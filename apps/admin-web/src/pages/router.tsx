import React from "react"
import Loading from "../components/Loading"
import HomePage from "./Home"
import LoginPage from "./auth/Login"
import SeniorsPage from "./dashboard/Seniors"
import NotFoundPage from "./NotFound"
import NewSeniorsPage from "./dashboard/SeniorsNew"
import AdministratorPage from "./dashboard/Administrators"

import { useAuth } from "../context/AuthContext"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"

interface RouteProps {
	condition: boolean
	redirectTo: string
}

const RouteProtector: React.FC<RouteProps> = ({ condition, redirectTo }) => {
	const { loading } = useAuth()
	if (loading) return <Loading />
	return condition ? <Navigate to={redirectTo} /> : <Outlet />
}

const Router: React.FC = () => {
	const { user, isAuthenticated } = useAuth()

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />

			<Route
				path="/auth/login"
				element={<RouteProtector condition={user !== null && isAuthenticated} redirectTo="/dashboard" />}
			>
				<Route path="" element={<LoginPage />} />
			</Route>

			<Route element={<RouteProtector condition={!user && !isAuthenticated} redirectTo="/auth/login" />}>
				<Route path="/dashboard" element={<HomePage />} />
				<Route path="/dashboard/adultos-mayores" element={<SeniorsPage />} />
				<Route path="/dashboard/adultos-mayores/nuevos" element={<NewSeniorsPage />} />
				<Route path="/dashboard/administradores" element={<AdministratorPage />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default Router
