import { getter, setter } from "elum-state/solid"
import { REQUESTS_ATOM } from "../../atoms"

/**
 * Cleaning up unused data
 */
type clear = (key: string, time?: number) => void

export const clear: clear = (key, time = 50_000) => {
  const keys = getter(REQUESTS_ATOM)
  if (!keys[key]) return

  const clear = setTimeout(() => {
    setter(REQUESTS_ATOM, (keys) => {
      const { [key]: removed, ...newKeys } = keys
      return newKeys
    })
  }, time + 10_000)

  setter(REQUESTS_ATOM, (keys) => {
    if (keys[key]?.clear) clearTimeout(keys[key]?.clear)

    return {
      ...keys,
      [key]: { ...keys[key], clear },
    }
  })
}
