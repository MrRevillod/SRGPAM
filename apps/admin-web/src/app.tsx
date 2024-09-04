import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout/Layout"

import Home from "./pages/Home/Index"
import AdministratorPage from "./pages/Dashboard/Administrators/Index"
import SeniorsPage from "./pages/Dashboard/Seniors/Index"

export default function App() {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />}></Route>

					<Route element={<SeniorsPage />}>
						<Route path="/dashboard/seniors" element={<SeniorsPage />} />
					</Route>
					<Route element={<AdministratorPage />}>
						<Route path="/dashboard/administrator" element={<AdministratorPage />} />
					</Route>
				</Routes>
			</Layout>
		</BrowserRouter>
	)
}
