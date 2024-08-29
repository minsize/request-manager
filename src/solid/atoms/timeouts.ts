import { atom } from 'elum-state/solid'

export const TIMEOUTS_ATOM = atom<Record<string, NodeJS.Timeout>>({
	key: '%time%',
	default: {},
})
