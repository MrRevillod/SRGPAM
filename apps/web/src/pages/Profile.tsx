import React from "react"
import { Input } from "../components/ui/Input"

import { useAuth } from "../context/AuthContext"

const ProfilePage: React.FC = () => {
	const { role } = useAuth()

	console.log(role)

	const roleFormatter = {
		ADMIN: "Administrador",
		PROFESSIONAL: "Profesional",
	}

	return (
		<div className="flex w-full login-container items-center justify-center absolute">
			<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/3 2xl:w-1/3 rounded-lg h-auto py-6">
				<div className="w-full flex flex-col items-center space-y-4 my-6">
					<div className="relative">
						<img
							src="https://img.wattpad.com/3b476bee1010537b280291a2351c9db47cb6cc69/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f59396c356e432d435970715148773d3d2d313032333434363734362e313636316631643432363766316136353731343532373739353538382e6a7067?s=fit&w=720&h=720"
							alt="User Profile"
							className="rounded-full w-32 h-32 object-cover border-4 border-white"
						/>
						<button className="absolute right-0 bottom-0 bg-green-800 text-white p-2 rounded-full border-2 border-white shadow-md">
							<i className="fas fa-camera"></i>
						</button>
					</div>

					<div className="text-center">
						<p className="text-gray-900">{roleFormatter[role as keyof typeof roleFormatter]}</p>
					</div>
				</div>

				<div className="w-full">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración de cuenta</h2>
					<form className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Nombre completo"
								name="firstName"
								type="text"
								placeholder="Benjamin Luis Ignacio Espinoza Parra"
							/>
							<Input label="Correo Electrónico" name="email" type="email" placeholder="bluis@alu.com" />
						</div>

						<div className="grid grid-cols-1 gap-4">
							<Input label="Rut" name="rut" type="text" placeholder="EJ:12.345.678-9" />
						</div>

						<div className="mt-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-2">Cambiar Contraseña</h3>
							<div className="grid grid-cols-2 gap-4">
								<Input
									label="Nueva contraseña"
									name="newPassword"
									type="password"
									placeholder="Ingrese su nueva contraseña"
								/>
								<Input
									label="Confirmar nueva contraseña"
									name="confirmNewPassword"
									type="password"
									placeholder="Confirme su nueva contraseña"
								/>
							</div>
						</div>

						<div className="mt-4">
							<button
								type="submit"
								className="bg-green-800 text-neutral-100 rounded-lg py-2 px-4 w-full lg:w-auto hover:bg-green-900 transition-colors"
							>
								Actualizar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
