import React from "react"
import UpdateProfile from "../components/forms/update/Profile"

import { Button } from "../components/ui/Button"
import { API_URL } from "../lib/axios"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { LoginVariant } from "../lib/types"
import { formatRole, formatRut } from "../lib/formatters"

const ProfilePage: React.FC = () => {
	const { user, role } = useAuth()
	const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false)

	const [imageSrc, setImageSrc] = useState<string>(`
		${API_URL}/storage/public/users/${user?.id}/${user?.id}.webp
	`)

	const handleImageError = () => {
		setImageSrc(`${API_URL}/storage/public/users/default-profile.webp`)
	}

	const handleShowUpdateForm = () => {
		setShowUpdateForm(!showUpdateForm)
	}

	return (
		<div className="flex w-full items-center justify-center profile-container">
			<div
				className={`transition-all duration-300 bg-light dark:bg-primary-dark rounded-lg shadow-lg p-8 relative w-full ${
					showUpdateForm ? "max-w-xl" : "max-w-md"
				}`}
			>
				{!showUpdateForm && (
					<div className="flex flex-col items-center justify-center">
						<div className="relative h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] rounded-full overflow-hidden border-1 border-gray dark:border-gray-medium">
							<img
								src={imageSrc}
								alt="profile"
								className="h-full w-full object-cover rounded-full"
								onError={() => handleImageError()}
							/>
						</div>

						<div className="text-center mt-4 space-y-2">
							<h2 className="text-2xl font-bold text-dark dark:text-light">{user?.name}</h2>
							<p className="text-gray dark:text-gray-light">{formatRut(user?.id.toString() || "")}</p>
							<p className="text-gray dark:text-gray-light">{formatRole(role as LoginVariant)}</p>
							<p className="text-gray dark:text-gray-light">{user?.email}</p>
						</div>

						<Button variant="primary" onClick={handleShowUpdateForm} className="w-3/4 mt-4">
							Actualizar perfil
						</Button>
					</div>
				)}

				{showUpdateForm && (
					<div className="flex flex-col justify-center items-center">
						<UpdateProfile setImageSrc={setImageSrc} setShowUpdateForm={setShowUpdateForm} />
					</div>
				)}
			</div>
		</div>
	)
}

export default ProfilePage
