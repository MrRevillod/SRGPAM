import React from "react"
import Header from "../components/ui/Header"
import { Show } from "../components/ui/Show"
import { useLocation } from "react-router-dom"

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation()

	return (
		<article className="h-screen w-screen">
			<Show when={!location.pathname.includes("auth")}>
				<Header />
			</Show>
			<main className="w-full">{children}</main>
		</article>
	)
}

export default AppLayout
