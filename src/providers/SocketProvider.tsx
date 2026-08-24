import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react"
import type { Socket } from "socket.io-client"
import { createSocket } from "../socket/socket"
import { SOCKET_ENABLED } from "../utils/env-utils"

const SocketContext = createContext<Socket | null | undefined>(undefined)

interface SocketProviderProps extends PropsWithChildren {
	urlName: string
}

export function SocketProvider({ children, urlName }: SocketProviderProps) {
	const [socket, setSocket] = useState<Socket | null>(null)

	useEffect(() => {
		if (!SOCKET_ENABLED) {
			return
		}

		const s = createSocket(urlName)
		s.connect()
		setSocket(s)

		return () => {
			s.disconnect()
		}
	}, [urlName])

	if (SOCKET_ENABLED && !socket) {
		return null
	}

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	)
}

export function useSocket() {
	const context = useContext(SocketContext)
	if (context === undefined) {
		throw new Error("useSocket must be used inside a SocketProvider")
	}
	return context
}
