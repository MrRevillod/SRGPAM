import React, { ReactNode } from "react"
import Header from "../components/ui/Header"

const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<article className="h-screen w-screen">
			<Header />
			<main className="w-full">{children}</main>
		</article>
	)
}

export default AppLayout
