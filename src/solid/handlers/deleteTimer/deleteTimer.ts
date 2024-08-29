import { setter } from "elum-state/solid"
import { TIMEOUTS_ATOM } from "../../atoms"

type deleteTimer = (key: string) => void

export const deleteTimer: deleteTimer = (key) => {
  setter(TIMEOUTS_ATOM, (keys) => {
    if (keys[key]) clearTimeout(keys[key])
    return keys
  })
}
