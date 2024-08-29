import { Status, ManagerError } from "../../types"
import { deleteTimer, set } from ".."

type end = (key: string, error?: ManagerError) => void

export const end: end = (key, error) => {
  deleteTimer(key)
  set(key, !!error ? Status.ERROR : Status.END, error)
}
