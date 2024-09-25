import React from "react"
import { api } from "../lib/axios"
import { createContext, useState, useEffect, ReactNode } from "react"

interface User {
	id: number
	name: string
	email: string
}

interface AuthContextType {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	login: (credentials: LoginCredentials) => Promise<void>
	logout: () => Promise<void>
	refreshToken: () => Promise<void>
}

interface LoginCredentials {
	email: string
	password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const login = async (credentials: LoginCredentials) => {
		setLoading(true)

		try {
			const response = await api.post("/auth/login?variant=ADMIN", credentials)
			setUser(response.data.values.user)
			setIsAuthenticated(true)
		} catch (error) {
			console.log(error)
			throw new Error("Error en el login")
		}

		setLoading(false)
	}

	const logout = async () => {
		setLoading(true)

		try {
			await api.post("/auth/logout")
		} catch (error) {
			console.log(error)
		} finally {
			setIsAuthenticated(false)
			setUser(null)
		}

		setLoading(false)
	}

	const checkAuth = async () => {
		setLoading(true)

		try {
			const response = await api.get("/auth/validate-auth")
			setIsAuthenticated(true)
			setUser(response.data.values.user)
		} catch (error) {
			setUser(null)
			setIsAuthenticated(false)
		}
		setLoading(false)
	}

	const refreshToken = async () => {
		setLoading(true)

		try {
			const response = await api.post("/auth/refresh")
			setUser(response.data.user)
			setIsAuthenticated(true)
		} catch (error) {
			setUser(null)
			setIsAuthenticated(false)
		}

		setLoading(false)
	}

	useEffect(() => {
		checkAuth()
	}, [])

	return (
		<AuthContext.Provider value={{ user, login, logout, refreshToken, loading, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = (): AuthContextType => {
	const context = React.useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth debe ser utilizado dentro de un AuthProvider")
	}
	return context
}

export default AuthContext
