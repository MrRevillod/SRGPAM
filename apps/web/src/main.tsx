import React from "react"
import Router from "./pages/router"
import ReactDOM from "react-dom/client"
import AppLayout from "./layouts/AppLayout"

import { AuthProvider } from "./context/AuthContext"
import { ModalProvider } from "./context/ModalContext"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"

import "./main.css"
import { SocketProvider } from "./context/SocketContext"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
	<ThemeProvider>
		<AuthProvider>
      <SocketProvider>
			  <ModalProvider>
				  <BrowserRouter>
					  <AppLayout>
						  <Router />
					  </AppLayout>
				  </BrowserRouter>
			  </ModalProvider>
      </SocketProvider
		</AuthProvider>
	</ThemeProvider>
)
