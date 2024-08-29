import { Status } from "../../types"
import { setter } from "elum-state/solid"
import { TIMEOUTS_ATOM } from "../../atoms"
import { clear, set } from ".."

type setTimer = (key: string, time: number) => void

export const setTimer: setTimer = (key, time = 200) => {
  const timer = setTimeout(() => set(key, Status.START_LOADER), time)

  setter(TIMEOUTS_ATOM, (keys) => {
    if (keys[key]) clearTimeout(keys[key])
    return { ...keys, [key]: timer }
  })
  clear(key, time)
}
