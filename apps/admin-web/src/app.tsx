import React from "react"

import AppLayout from "./layout"
import LoginPage from "./pages/auth/Login"
import SeniorsPage from "./pages/dashboard/Seniors/Index"
import AdministratorPage from "./pages/dashboard/Administrators/Index"

import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App() {
	return (
		<BrowserRouter>
			<AppLayout>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/dashboard/adultos-mayores" element={<SeniorsPage />} />
					<Route path="/dashboard/administradores" element={<AdministratorPage />} />
				</Routes>
			</AppLayout>
		</BrowserRouter>
	)
}
