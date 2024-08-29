import { type Accessor, createEffect, createSignal } from "solid-js"

import { globalSignal } from "elum-state/solid"
import { REQUESTS_ATOM } from "../../../solid/atoms"
import { Status, ManagerError } from "../../../solid/types"
import { end, set, start } from "../../../solid/handlers"

type globalRequestManager = (key: string) => [
  {
    status: Accessor<{ status: Status; error?: ManagerError }>
    isDisabled: (block?: boolean) => boolean
    isLoader: (loader?: boolean) => boolean
  },
  set: (status: Status) => void,
]

export const globalRequestManager: globalRequestManager = (key) => {
  const [requests] = globalSignal(REQUESTS_ATOM)
  const [status, setStatus] = createSignal(
    requests()[key] || { status: Status.UNKNOWN },
  )

  createEffect(() => {
    const newStatus = requests()[key] || { status: Status.UNKNOWN }
    setStatus(newStatus)
  })

  const handlerSetKey = (status: Status, error?: ManagerError) => {
    const actions: Record<string, () => void> = {
      [Status.START]: () => start(key),
      [Status.END]: () => end(key),
      [Status.ERROR]: () => end(key, error),
    }

    if (!!actions[status]) {
      actions[status]()
    } else set(key, status, error)
  }

  /**
   * Should I lock the buttons or not
   *
   * @returns boolean
   */
  const isDisabled = (block?: boolean) =>
    status().status === Status.START || !!block

  /**
   * Do I need to show the loader
   *
   * @returns boolean
   */
  const isLoader = (loader?: boolean) =>
    status().status === Status.START_LOADER || !!loader

  return [
    {
      status,
      isDisabled,
      isLoader,
    },
    handlerSetKey,
  ]
}
