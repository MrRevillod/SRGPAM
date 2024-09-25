import React from "react"
import { Link } from "react-router-dom"

const HomePage: React.FC = () => {
	return (
		<div className="screen-container flex items-center justify-center flex-col gap-8">
			<h1 className="font-semibold text-5xl text-green-700">Página de inicio</h1>
			<h2>Dirección de adultos mayores de la municipalidad de Temuco</h2>
			<Link
				to="/auth/login"
				className="btn btn-primary bg-green-700 px-8 py-2 rounded-lg font-semibold text-neutral-100"
			>
				Iniciar sesión
			</Link>
		</div>
	)
}

export default HomePage
