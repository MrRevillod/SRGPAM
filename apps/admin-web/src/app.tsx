import React from "react"

import Home from "./pages/home/Index"
import AppLayout from "./layout"
import LoginPage from "./pages/auth/Login"
import SeniorsPage from "./pages/dashboard/Seniors/Index"
import AdministratorPage from "./pages/dashboard/Administrators/Index"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function App() {
	const queryClient: QueryClient = new QueryClient()

	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AppLayout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route element={<LoginPage />} path="/auth/login" />
						<Route path="/dashboard/adultos-mayores" element={<SeniorsPage />} />
						<Route path="/dashboard/administradores" element={<AdministratorPage />} />
					</Routes>
				</AppLayout>
			</QueryClientProvider>
		</BrowserRouter>
	)
}
