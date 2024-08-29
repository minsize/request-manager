import { ManagerError, Status } from "../../types"
import { end, start } from ".."
import { getter } from "elum-state/solid"
import { REQUESTS_ATOM } from "../../../solid/atoms"

type requestManager = (
  key: string,
  {
    autoStart,
    time,
  }?: {
    autoStart?: boolean
    time?: number
  },
) => {
  start: (loaderStart?: number) => void
  end: (error?: ManagerError) => void
  get: () => { status: Status; error?: ManagerError }
}
export const requestManager: requestManager = (
  key,
  params = { autoStart: true, time: 200 },
) => {
  if (params.autoStart) start(key, params.time)
  return {
    start: (time) => start(key, time),
    end: (error) => end(key, error),
    get: () => getter(REQUESTS_ATOM)[key] || { status: Status.UNKNOWN },
  }
}
