import React, { ReactNode } from "react"
import Header from "./components/ui/Header"

const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<article>
			<Header />
			<main className="container mx-auto px-4 py-4">{children}</main>
			<footer className="bg-gray-100 text-center py-4">
				<p>Dirección de adultos mayores de la municipalidad de Temuco - {new Date().getFullYear()}</p>
			</footer>
		</article>
	)
}

export default AppLayout
