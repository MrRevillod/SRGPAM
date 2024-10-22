import { SERVER_URL } from "@/utils/request"
import { makeAuthenticatedRequest } from "@/utils/request"
import { storeTokens, storeUser } from "@/utils/storage"
import { loginSeniorFormData, User } from "@/utils/types"
import axios from "axios"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Alert } from "react-native"

interface authContextProps {
	isAuthenticated: boolean
	user: User | null
	role: "SENIOR" | null
	loading: boolean
	login: (credentials: loginSeniorFormData) => Promise<void>
}

const AuthContext = createContext<authContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<"SENIOR" | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const login = async (credentials: loginSeniorFormData) => {
		setLoading(true)

		try {
			const response = await axios.post(`${SERVER_URL}/api/auth/login-senior`, credentials)
			const { message, values } = response.data
			const { accessToken, refreshToken, publicUser } = values
			storeTokens(accessToken, refreshToken)
			storeUser(publicUser)
			setRole("SENIOR")
			Alert.alert("Éxito", message)
		} catch (error: any) {
			error.response.data.message && Alert.alert("Error", error.response.data.message)
		}

		setLoading(false)
	}

	const checkAuth = async () => {
		setLoading(true)
		try {
			const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/auth/validate-auth`, "GET", false)

			if (response) {
				setIsAuthenticated(true)
				setUser(response.data.values.user)
				setRole(response.data.values.role)
			}
		} catch (error) {
			setUser(null)
			setRole(null)
			setIsAuthenticated(false)
		}
		setLoading(false)
	}

	useEffect(() => {
		checkAuth()
		console.warn(isAuthenticated)
	}, [])

	return <AuthContext.Provider value={{ isAuthenticated, user, role, loading, login }}>{children}</AuthContext.Provider>
}

export const useAuth = (): authContextProps => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth debe ser utilizado dentro de un AuthProvider")
	}
	return context
}

export default AuthContext
