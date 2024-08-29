import { Status, ManagerError } from "../../../solid/types"
import { clear, requestManager, set } from ".."
import { REQUESTS_ATOM } from "../../../solid/atoms"
import { getter, setter } from "elum-state/solid"

type OnResponse = (response: Response) => {
  status: Status
  error?: ManagerError
}

type OnResponseMax = (response: "maxRequests") => boolean

export const fetchManager = async (
  key: string,
  input: string | URL | globalThis.Request,
  init: RequestInit | undefined,
  {
    onResponse,
    maxRequests = 5,
    resetDuration = 1_000,
  }: {
    onResponse: OnResponse & OnResponseMax
    maxRequests: number
    resetDuration: number
  },
): Promise<Response | "maxRequests"> => {
  const manager = requestManager(key)

  setter(REQUESTS_ATOM, (keys) => {
    let currentRequests = keys[key]?.requests || { count: 0, time: null }

    if (currentRequests.time && currentRequests.time.getTime() < Date.now()) {
      currentRequests.count = 1
      currentRequests.time = new Date(Date.now() + resetDuration)
    } else {
      currentRequests.count += 1

      if (!currentRequests.time) {
        currentRequests.time = new Date(Date.now() + resetDuration)
      }
    }

    return {
      ...keys,
      [key]: {
        ...keys[key],
        ...currentRequests,
      },
    }
  })
  clear(key)

  const isMaxRequests = getter(REQUESTS_ATOM)[key]?.requests?.count || 0
  if (isMaxRequests >= maxRequests) {
    if (onResponse) {
      const status = onResponse("maxRequests")
      if (status) return "maxRequests"
    }
  }

  try {
    const response = await fetch(input, init)

    if (!response.ok) manager.end({ network: true })

    if (onResponse) {
      const { status, error } = onResponse(response.clone())
      const actions: Record<string, () => void> = {
        [Status.START]: () => manager.start(),
        [Status.END]: () => manager.end(),
        [Status.ERROR]: () => manager.end(error),
      }

      if (!!actions[status]) {
        actions[status]()
      } else set(key, status)
    }
    return response
  } catch (error) {
    manager.end({ unknown: true })
    throw error
  }
}
