import { makeAuthenticatedRequest } from "@/utils/request"
import { User } from "@/utils/types"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface authContextProps {
	isAuthenticated: boolean
	user: User | null
	role: "SENIOR" | null
	loading: boolean
	error: string | null
}

const AuthContext = createContext<authContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<"SENIOR" | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const checkAuth = async () => {
		setLoading(true)
		try {
			const response = await makeAuthenticatedRequest("/auth/validate-auth", "GET")
			if (response) {
				setIsAuthenticated(true)
				setUser(response.data.values.user)
				setRole(response.data.values.role)
			}
		} catch (error) {
			setUser(null)
			setIsAuthenticated(false)
		}
	}

	useEffect(() => {
		checkAuth()
	}, [])

	return <AuthContext.Provider value={{ isAuthenticated, user, role, loading, error }}>{children}</AuthContext.Provider>
}

export const useAuth = (): authContextProps => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth debe ser utilizado dentro de un AuthProvider")
	}
	return context
}

export default AuthContext
