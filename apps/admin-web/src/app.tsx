import React from "react"
import AppLayout from "./layouts/AppLayout"
import LoginPage from "./pages/auth/Login"
import SeniorsPage from "./pages/dashboard/Seniors"
import AdministratorPage from "./pages/dashboard/Administrators"
import NewSeniorsPage from "./pages/dashboard/SeniorsNew"
import RouteProtector from "./router"

import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppLayout>
					<Routes>
						<Route path="/auth/login" element={<LoginPage />} />
						<Route element={<RouteProtector />}>
							<Route path="/dashboard/adultos-mayores" element={<SeniorsPage />} />
							<Route path="/dashboard/adultos-mayores/nuevos" element={<NewSeniorsPage />} />
							<Route path="/dashboard/administradores" element={<AdministratorPage />} />
						</Route>
						<Route path="*" element={<div>404</div>} />
					</Routes>
					<Toaster position="top-right" />
				</AppLayout>
			</AuthProvider>
		</BrowserRouter>
	)
}
