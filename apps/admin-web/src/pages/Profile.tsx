import React, { useState } from "react"
import { Input } from "../components/ui/Input"

const ProfilePage: React.FC = () => {
	const [activeTab, setActiveTab] = useState("account")

	const handleTabChange = (tab: string) => {
		setActiveTab(tab)
	}

	return (
		<div
			className="flex flex-col lg:flex-row min-h-screen p-8 space-y-6 lg:space-y-0 lg:space-x-8"
			style={{
				background: "linear-gradient(135deg, #c3ec52 0%, #0ba29d 100%)",
			}}
		>
			<aside className="lg:w-1/4 bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center space-y-4 transition-transform transform hover:scale-105">
				<div className="relative">
					<img
						src="https://img.wattpad.com/3b476bee1010537b280291a2351c9db47cb6cc69/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f59396c356e432d435970715148773d3d2d313032333434363734362e313636316631643432363766316136353731343532373739353538382e6a7067?s=fit&w=720&h=720"
						alt="User Profile"
						className="rounded-full w-32 h-32 object-cover border-4 border-white"
					/>
					<button className="absolute right-0 bottom-0 bg-blue-500 text-white p-2 rounded-full border-2 border-white shadow-md">
						<i className="fas fa-camera"></i>
					</button>
				</div>

				<div className="text-center">
					<h2 className="text-xl font-semibold">Benjamin Luis Ignacio Espinoza Parra</h2>
					<p className="text-gray-500">UCT</p>
				</div>

				<div className="w-full text-left space-y-2">
					<div className="flex justify-between">
						<span className="font-medium">Opportunities applied</span>
						<span className="text-orange-500 font-bold">32</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Opportunities won</span>
						<span className="text-green-500 font-bold">26</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Current opportunities</span>
						<span className="text-blue-500 font-bold">6</span>
					</div>
				</div>

				<button className="mt-4 bg-blue-500 text-white rounded-lg py-2 px-4 w-full hover:bg-blue-600 transition-colors">
					Ver Perfil
				</button>
				<p className="text-sm text-gray-500 mt-2">https://domain.com/user</p>
			</aside>

			<div className="lg:w-3/4 bg-white shadow-xl rounded-2xl p-8 flex-grow transition-transform transform hover:scale-105">
				<div className="border-b border-gray-200 mb-6">
					<ul className="flex space-x-4">
						<li>
							<button
								className={`py-2 px-4 ${activeTab === "account" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
								onClick={() => handleTabChange("account")}
							>
								Configuración de cuenta
							</button>
						</li>
						<li>
							<button
								className={`py-2 px-4 ${activeTab === "notifications" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
								onClick={() => handleTabChange("notifications")}
							>
								Notificaciones
							</button>
						</li>
					</ul>
				</div>

				{activeTab === "account" && (
					<div>
						<h2 className="text-xl font-semibold mb-6">Configuración de cuenta</h2>
						<form className="space-y-4">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Input
									label="Nombre completo"
									name="firstName"
									type="text"
									defaultValue="Benjamin Luis Ignacio Espinoza Parra"
								/>
							</div>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Input
									label="Correo Electronico"
									name="email"
									type="email"
									defaultValue="bluis@alu.com"
								/>
							</div>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Input label="Rut" name="rut" type="text" defaultValue="21.190.399-6" />
							</div>

							<div className="mt-4">
								<button
									type="submit"
									className="bg-blue-500 text-white rounded-lg py-2 px-4 w-full lg:w-auto hover:bg-blue-600 transition-colors"
								>
									Actualizar
								</button>
							</div>
						</form>
					</div>
				)}

				{activeTab === "notifications" && (
					<div>
						<h2 className="text-xl font-semibold mb-6">Notificaciones</h2>
						<p>No hay notificaciones.</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProfilePage
