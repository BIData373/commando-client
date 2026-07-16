import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react"
import type { Socket } from "socket.io-client"
import { createSocket } from "../socket/socket"

const SocketContext = createContext<Socket | null>(null)

interface SocketProviderProps extends PropsWithChildren {
	urlName: string
}

export function SocketProvider({ children, urlName }: SocketProviderProps) {
	const [socket, setSocket] = useState<Socket | null>(null)

	useEffect(() => {
		const s = createSocket(urlName)
		s.connect()
		setSocket(s)

		return () => {
			s.disconnect()
		}
	}, [urlName])

	if (!socket) return null

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	)
}

export function useSocket() {
	const context = useContext(SocketContext)
	if (!context) {
		throw new Error("useSocket must be used inside a SocketProvider")
	}
	return context
}
