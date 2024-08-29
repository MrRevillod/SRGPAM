import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home/Index"
import AdministratorPage from "./pages/Dashboard/Administrators/Index"
import SeniorsPage from "./pages/Dashboard/Seniors/Index"

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />}></Route>

				<Route element={<SeniorsPage />}>
					<Route path="/dashboard/seniors" element={<SeniorsPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
