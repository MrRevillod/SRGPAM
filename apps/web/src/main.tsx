import React from "react"
import Router from "./pages/router"
import ReactDOM from "react-dom/client"
import AppLayout from "./layouts/AppLayout"

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import "./main.css"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
	<AuthProvider>
		<BrowserRouter>
			<AppLayout>
				<Router />
			</AppLayout>
		</BrowserRouter>
	</AuthProvider>
)
