import type {
	DefaultEventsMap,
	ReservedOrUserListener,
} from "@socket.io/component-emitter"
import { useEffect } from "react"
import type { SocketEvent } from "src/api/model"
import { useSocket } from "../providers/SocketProvider"

type SocketFunction = ReservedOrUserListener<
	DefaultEventsMap,
	DefaultEventsMap,
	SocketEvent
>
type SocketListeners = Record<SocketEvent, SocketFunction>

function applyListeners(
	listeners: SocketListeners,
	predicate: (message: SocketEvent, callback: SocketFunction) => void,
) {
	Object.entries(listeners).forEach(([message, callback]) => {
		predicate(message as SocketEvent, callback)
	})
}

export function useSocketHandler(listeners: SocketListeners) {
	const socket = useSocket()

	useEffect(() => {
		applyListeners(listeners, socket.on.bind(socket))

		return () => {
			applyListeners(listeners, socket.off.bind(socket))
		}
	}, [listeners])
}
