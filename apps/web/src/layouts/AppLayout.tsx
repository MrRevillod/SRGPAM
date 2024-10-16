import React from "react"
import Header from "../components/ui/Header"

import { Show } from "../components/ui/Show"
import { useAuth } from "../context/AuthContext"

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, user } = useAuth()

	return (
		<article className="max-h-screen h-screen w-screen dark:bg-primary-dark">
			<Show when={isAuthenticated && user !== null}>
				<Header />
			</Show>
			<main className="w-full">{children}</main>
		</article>
	)
}

export default AppLayout
