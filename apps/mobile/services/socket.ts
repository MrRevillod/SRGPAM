import { SERVER_URL } from "@/constants/colors"
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const connectSocket = (userRole: string, userId: string): Socket => {
	if (!socket) {
		socket = io(`${SERVER_URL}:5000`, {
			query: {
				userRole,
				userId,
				transports: ["websocket"],
			},
		})

		socket.on("connect", () => {
			console.log("Conectado al servidor de Socket.IO")
		})

		socket.on("disconnect", () => {
			console.log("Desconectado del servidor de Socket.IO")
		})
	}
	return socket
}

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect()
		console.log("Socket desconectado manualmente")
		socket = null
	}
}

export const listenToEvent = (eventName: string, callback: (data: any) => void) => {
	if (socket) {
		socket.on(eventName, callback)
	}
}

export const emitEvent = (eventName: string, data: any) => {
	if (socket) {
		socket.emit(eventName, data)
	}
}
