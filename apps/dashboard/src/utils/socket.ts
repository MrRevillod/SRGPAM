import { UserRole } from "@repo/lib"
import { Server, Socket } from "socket.io"

interface Client {
	socketId: string
	userId: string
}

// Arreglo para almacenar los clientes conectados
const clients: Client[] = []

// Función para agregar un cliente al arreglo
export const addClient = (client: Client): void => {
	clients.push(client)
}

// Función para remover un cliente cuando se desconecta
export const removeClient = (socketId: string): void => {
	const index = clients.findIndex((client) => client.socketId === socketId)
	if (index !== -1) clients.splice(index, 1)
}

// Función para encontrar un cliente por userId
export const getClientByUserId = (userId: string): Client | undefined => {
	return clients.find((client) => client.userId === userId)
}

// Exportar el arreglo de clientes por si es necesario en otro lugar
export const getClients = (): Client[] => clients

export const initSocket = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		const role = socket.handshake.query.userRole as UserRole
		const userId = socket.handshake.query.userType as string

		socket.join(role)
		addClient({ socketId: socket.id, userId })

		console.log("new client!")
	})
}
