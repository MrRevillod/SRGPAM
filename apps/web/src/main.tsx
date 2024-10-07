import React from "react"
import Router from "./pages/router"
import ReactDOM from "react-dom/client"
import AppLayout from "./layouts/AppLayout"

import { AuthProvider } from "./context/AuthContext"
import { ModalProvider } from "./context/ModalContext"
import { BrowserRouter } from "react-router-dom"

import "./main.css"
import { ConfigProvider } from "antd"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
	<ConfigProvider theme={{ token: { colorPrimary: "#046c4e" } }}>
		<AuthProvider>
			<ModalProvider>
				<BrowserRouter>
					<AppLayout>
						<Router />
					</AppLayout>
				</BrowserRouter>
			</ModalProvider>
		</AuthProvider>
	</ConfigProvider>
)
