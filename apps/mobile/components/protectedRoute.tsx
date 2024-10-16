import React, { useEffect } from "react"
import { useAuth } from "@/contexts/authContext"
import { View, ActivityIndicator } from "react-native"

const ProtectedRoute = ({ children, navigation }: { children: React.ReactNode; navigation: any }) => {
	const { isAuthenticated, loading } = useAuth()

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			navigation.navigate("Login")
		}
	}, [isAuthenticated, loading, navigation])

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		)
	}

	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}

export default ProtectedRoute
