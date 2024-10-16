import React from "react"

import { api } from "../lib/axios"
import { Dispatch, SetStateAction } from "react"
import { LoginFormData, LoginVariant, User } from "../lib/types"
import { createContext, ReactNode, useEffect, useState } from "react"

// Contexto para manejar la autenticación de los usuarios
// Se utiliza un contexto ya que la autenticación es necesaria
// en toda la aplicación web

interface AuthContextType {
	isAuthenticated: boolean
	user: User | null
	loading: boolean
	error: string | null
	role: LoginVariant | null
	login: (credentials: LoginFormData) => Promise<void>
	logout: () => Promise<void>
	refreshToken: () => Promise<void>
	setUser: Dispatch<SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// isAuthenticated: Indica si el usuario está autenticado o no
// user: Datos del usuario autenticado
// loading: Indica si la petición está en proceso
// error: Mensaje de error en caso de que ocurra un error
// role: Rol del usuario autenticado

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [role, setRole] = useState<LoginVariant | null>(null)

	// login: Función para iniciar sesión en la aplicación
	const login = async (credentials: LoginFormData) => {
		setLoading(true)

		try {
			const response = await api.post(`/auth/login?variant=${credentials.role}`, {
				email: credentials.email,
				password: credentials.password,
            })
            console.log(response)
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

	// logout: Función para cerrar sesión en la aplicación
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

	// checkAuth: Función para validar la autenticación del usuario
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

	// refreshToken: Función para refrescar el token de autenticación
	const refreshToken = async () => {
		setLoading(true)

		try {
			const response = await api.get("/auth/refresh")
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
		<AuthContext.Provider
			value={{ role, user, setUser, login, error, logout, refreshToken, loading, isAuthenticated }}
		>
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
