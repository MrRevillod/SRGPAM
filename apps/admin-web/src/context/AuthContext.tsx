import { LoginVariant, User } from "../lib/types"
import React, { createContext, useContext, useState, ReactNode, Dispatch, useEffect } from "react"
import { useRequestStore } from "./RequestStore"
import { validateSessionOpts } from "../lib/requests"

type AuthContextType = {
	user: User | null
	isAuthenticated: boolean
	setAuth: (auth: boolean, user: User) => void
	resetAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState<User | null>(null)

	const { isLoading, status, data, useRequest, reset } = useRequestStore()

	const setAuth = (auth: boolean, user: User) => {
		setIsAuthenticated(auth)
		setUser(user)
	}

	const resetAuth = () => {
		setIsAuthenticated(false)
		setUser(null)
	}

	useEffect(() => {
		const checkAuth = async () => {
			await useRequest(validateSessionOpts, false)
			if (status === "success" && data) {
				setAuth(true, data.values.user)
			} else {
				resetAuth()
			}

			reset()
		}

		checkAuth()
	}, [])

	return <AuthContext.Provider value={{ user, isAuthenticated, setAuth, resetAuth }}>{children}</AuthContext.Provider>
}
