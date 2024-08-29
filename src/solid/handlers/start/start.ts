import { Status } from "../../types"
import { clear, set, setTimer } from ".."

/**
 * Start a query and set a timer for N milliseconds
 *
 * @example start("key", 200)
 */
type start = (key: string, time?: number) => void
export const start: start = (key, time = 200) => {
  set(key, Status.START)
  setTimer(key, time)
}
