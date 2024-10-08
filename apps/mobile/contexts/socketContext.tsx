import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { connectSocket, disconnectSocket } from "@/services/socket"

interface SocketContextProps {
	isConnected: boolean
	userRole: string
	userId: string
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined)

export const SocketProvider: React.FC<{ userRole: string; userId: string; children: ReactNode }> = ({ userRole, userId, children }) => {
	const [isConnected, setIsConnected] = useState(false)

	useEffect(() => {
		// Conectar el socket cuando el componente se monte
		connectSocket(userRole, userId)
		setIsConnected(true)

		// Desconectar el socket cuando el componente se desmonte
		return () => {
			disconnectSocket()
			setIsConnected(false)
		}
	}, [userRole, userId])

	return <SocketContext.Provider value={{ isConnected, userRole, userId }}>{children}</SocketContext.Provider>
}

// Hook para acceder al contexto
export const useSocketContext = () => {
	const context = useContext(SocketContext)
	if (!context) {
		throw new Error("useSocketContext must be used within a SocketProvider")
	}
	return context
}
