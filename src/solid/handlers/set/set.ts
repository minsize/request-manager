import { Status, ManagerError } from "../../types"
import { setter } from "elum-state/solid"
import { REQUESTS_ATOM } from "../../../solid/atoms"
import { clear } from "../clear/clear"

/**
 * Setting the request blocking status
 *
 * @example set("key", Status.START)
 */
type set = (key: string, status: Status, error?: ManagerError) => void

export const set: set = (key, status, error) => {
  /**
   * Cleaning up unused data
   */
  setter(REQUESTS_ATOM, (keys) => ({
    ...keys,
    [key]: {
      status,
      error,
      requests: {
        count: 0,
        time: new Date(),
      },
    },
  }))
  clear(key)
}
