export const requestUsernameKey = "request_username"
export const isBIKey = "is_bi"

export function getRequestIdentity() {
	const rawUsername = localStorage.getItem(requestUsernameKey)
	const username =
		rawUsername !== null ? (JSON.parse(rawUsername) as string | null) : null
	const rawIsBI = localStorage.getItem(isBIKey)
	const isBI = rawIsBI !== null ? rawIsBI === "true" : null
	return { username, isBI }
}
