import React from "react"
import HomePage from "./dashboard/Home"
import LoginPage from "./auth/Login"
import EventsPage from "./dashboard/Events"
import CentersPage from "./dashboard/Centers"
import SeniorsPage from "./dashboard/Seniors"
import ProfilePage from "./Profile"
import ServicesPage from "./dashboard/Services"
import NotFoundPage from "./NotFound"
import NewSeniorsPage from "./dashboard/SeniorsNew"
import StatisticsPage from "./dashboard/Statistics"
import AdministratorPage from "./dashboard/Administrators"
import ProfessionalsPage from "./dashboard/Professionals"
import ResetPasswordPage from "./auth/ResetPassword"
import ValidatePasswordPage from "./auth/Password"
import SeniorRegisterRequestPage from "./dashboard/SeniorRegisterRequest"

import { Loading } from "../components/Loading"
import { useAuth } from "../context/AuthContext"
import { UserRole } from "../lib/types"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"

interface RouteProps {
	redirectTo: string
	allowedRoles?: UserRole[] // ["ADMIN", "PROFESSIONAL"]
}

// Componente para proteger rutas de la aplicación
// Recibe ruta de dirección a la que redirigir en caso de no estar autenticado
// o de no cumplir con los roles permitidos para ingresar a la ruta

const ProtectedRoute: React.FC<RouteProps> = ({ redirectTo, allowedRoles }) => {
	// Obtenemos los datos de autenticación del contexto de autenticación
	const { loading, isAuthenticated, role } = useAuth()

	if (loading) return <Loading />

	// Si no se especifican roles se lanza un error (desarrollo)
	if (allowedRoles && !allowedRoles.at(0)) {
		throw new Error("Se debe especificar al menos un rol permitido")
	}

	// Si no está autenticado o no tiene un rol o no tiene un rol permitido
	// se redirige a la ruta especificada
	if (!isAuthenticated || !role || !allowedRoles?.includes(role)) {
		return <Navigate to={redirectTo} />
	}

	// Si cumple con los requisitos se renderiza la ruta
	// El componente Outlet es necesario para renderizar las rutas hijas

	return <Outlet />
}

const RedirectRoute: React.FC = () => {
	const { loading, isAuthenticated, role } = useAuth()

	if (loading) return <Loading />

	// Si el usuario está autenticado, redirigirlo dependiendo del rol
	if (isAuthenticated) {
		// Return el componente Navigate para que funcione correctamente
		return role === "PROFESSIONAL" ? <Navigate to="/agenda" /> : <Navigate to="/" />
	}

	// Si no está autenticado, se renderiza la ruta hija (como el login)
	return <Outlet />
}

const Router: React.FC = () => {
	return (
		<Routes>
			<Route element={<ProtectedRoute redirectTo="/auth/login" allowedRoles={["ADMIN"]} />}>
				<Route path="/inicio" element={<HomePage />} />
				<Route path="/perfil" element={<ProfilePage />} />
				<Route path="/administradores" element={<AdministratorPage />} />
				<Route path="/profesionales" element={<ProfessionalsPage />} />
				<Route path="/personas-mayores" element={<SeniorsPage />} />
				<Route path="/personas-mayores/nuevos" element={<NewSeniorsPage />} />
				<Route path="/personas-mayores/solicitud-de-registro" element={<SeniorRegisterRequestPage />} />
				<Route path="/servicios" element={<ServicesPage />} />
				<Route path="/centros-de-atencion" element={<CentersPage />} />
			</Route>

			<Route element={<ProtectedRoute redirectTo="/auth/login" allowedRoles={["ADMIN", "PROFESSIONAL"]} />}>
				<Route path="/agenda" element={<EventsPage />} />
				<Route path="/estadisticas" element={<StatisticsPage />} />
			</Route>

			<Route element={<RedirectRoute />}>
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/reset-password" element={<ResetPasswordPage />} />
				<Route path="/auth/reset-password/:id/:token/:role" element={<ValidatePasswordPage />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}

export default Router
