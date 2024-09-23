import React from "react"
import Router from "./pages/router"
import ReactDOM from "react-dom/client"
import AppLayout from "./layouts/AppLayout"

import { Toaster } from "sonner"

import "./main.css"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
	<AuthProvider>
		<BrowserRouter>
			<AppLayout>
				<Router />
				<Toaster position="top-right" />
			</AppLayout>
		</BrowserRouter>
	</AuthProvider>
)
