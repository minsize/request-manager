import { atom } from "elum-state/solid"
import { Status, ManagerError } from "../../solid/types"

export const REQUESTS_ATOM = atom<
  Record<
    string,
    {
      status: Status
      error?: ManagerError
      requests: {
        count: number
        time: Date
      }
      clear?: NodeJS.Timeout
    }
  >
>({
  key: "%array%",
  default: {},
})
