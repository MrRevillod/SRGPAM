import React, { useState } from "react"
import { Input } from "../components/ui/Input"
import { useAuth } from "../context/AuthContext"
import { formatRut } from "../lib/formatters"
import { api } from "../lib/axios"

const ProfilePage: React.FC = () => {
	const { user } = useAuth()

	return (
		<div className="flex w-full login-container items-center justify-center min-h-screen bg-cover bg-center relative">
			<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/3 2xl:w-1/3 rounded-lg py-16 shadow-lg relative space-y-10 max-w-md">
				<div className="w-full flex flex-col items-center space-y-8">
					<div className="relative">
						<img
							src="https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
							alt="User Profile"
							className="rounded-full w-32 h-32 object-cover border-4 border-white"
						/>
					</div>
					<div className="text-center space-y-2">
						<h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
						<p className="text-gray-600">{formatRut(user?.id.toString() || "")}</p>
						<p className="text-gray-500">{user?.email}</p>
						<p className="text-gray-600 font-semibold">{localStorage.getItem("SELECTED_ROLE")}</p>
					</div>
				</div>

				<button className="bg-green-800 text-white py-3 px-8 rounded-lg mt-6">Actualizar</button>
			</div>
		</div>
	)
}

export default ProfilePage
