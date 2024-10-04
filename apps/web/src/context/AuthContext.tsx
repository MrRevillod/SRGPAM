import React from "react"
import { api } from "../lib/axios"
import { LoginFormData, LoginVariant, User } from "../lib/types"
import { createContext, ReactNode, useEffect, useState } from "react"

interface AuthContextType {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error: string | null
	role: LoginVariant | null
	login: (credentials: LoginFormData) => Promise<void>
	logout: () => Promise<void>
	refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [role, setRole] = useState<LoginVariant | null>(null)

	const login = async (credentials: LoginFormData) => {
		setLoading(true)

		try {
			const response = await api.post("/auth/login?variant=ADMIN", credentials)
			setUser(response.data.values.user)
			setIsAuthenticated(true)
			setError(null)
			setRole(response.data.values.role)
		} catch (error: any) {
			setError(error.response.data.message)
			setRole(null)
			setUser(null)
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
			setRole(null)
		}

		setLoading(false)
	}

	const checkAuth = async () => {
		setLoading(true)

		try {
			const response = await api.get("/auth/validate-auth")
			setIsAuthenticated(true)
			setUser(response.data.values.user)
			setRole(response.data.values.role)
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
			setRole(response.data.values.role)
			setIsAuthenticated(true)
		} catch (error) {
			setUser(null)
			setRole(null)
			setIsAuthenticated(false)
		}

		setLoading(false)
	}

	useEffect(() => {
		checkAuth()
	}, [])

	return (
		<AuthContext.Provider value={{ role, user, login, error, logout, refreshToken, loading, isAuthenticated }}>
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
