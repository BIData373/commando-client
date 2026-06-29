import { useLocalStorage } from "@mantine/hooks"
import { isBIKey, requestUsernameKey } from "src/axios"

export function useBIBypass() {
	const [username, setUsername] = useLocalStorage<string | null>({
		key: requestUsernameKey,
		defaultValue: null,
	})

	const [isBI, setIsBI] = useLocalStorage<boolean | null>({
		key: isBIKey,
		defaultValue: true,
	})

	return { username, setUsername, isBI, setIsBI }
}
