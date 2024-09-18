import React, { useEffect, useState } from "react"
import { useAuth } from "./context/AuthContext"
import { useRequestStore } from "./context/RequestStore"
import { Navigate, Outlet } from "react-router-dom"

const RouteProtector = () => {
	const { isAuthenticated } = useAuth()
	const { isLoading } = useRequestStore()

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace />
	}

	return <Outlet />
}

export default RouteProtector
