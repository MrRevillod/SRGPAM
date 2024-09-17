import React from "react"
import AppLayout from "./layouts/AppLayout"
import LoginPage from "./pages/auth/Login"
import SeniorsPage from "./pages/dashboard/Seniors"
import AdministratorPage from "./pages/dashboard/Administrators"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import NewSeniorsPage from "./pages/dashboard/SeniorsNew"

export default function App() {
	return (
		<BrowserRouter>
			<AppLayout>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/dashboard/adultos-mayores" element={<SeniorsPage />} />
					<Route path="/dashboard/adultos-mayores/nuevos" element={<NewSeniorsPage />} />
					<Route path="/dashboard/administradores" element={<AdministratorPage />} />
				</Routes>
			</AppLayout>
		</BrowserRouter>
	)
}
