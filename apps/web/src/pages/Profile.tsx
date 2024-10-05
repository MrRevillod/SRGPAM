import React, { useState, useEffect } from "react"
import { Input } from "../components/ui/Input"
import { useAuth } from "../context/AuthContext"
import { formatRut } from "../lib/formatters"
import Form from "../components/forms/Form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdministratorSchemas } from "../lib/schemas"
import { User } from "../lib/types"
import { Image } from "antd"
import InputFile from "../components/ui/InputFile"

const ProfilePage: React.FC = () => {
	const { user } = useAuth()
	const [modalType, setModalType] = useState("")
	const [selectedProfile, setSelectedProfile] = useState<User | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const [loading, setLoading] = useState(true)

	const formContext = useForm({
		resolver: zodResolver(AdministratorSchemas.Update),
	})

	const {
		reset,
		control,
		register,
		formState: { errors },
	} = formContext

	useEffect(() => {
		reset({
			id: user?.id,
			name: user?.name,
			email: user?.email,
		})
	}, [user])
	const onSubmit = async (formData: any) => {}

	const showModal = (type: string, element: User | null) => {
		setModalType(type)
		setSelectedProfile(element)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
		setSelectedProfile(null)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setSelectedProfile(null)
	}

	return (
		<div className="flex w-full profile-container items-center justify-center absolute">
			<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/3 2xl:w-1/3 rounded-lg py-16 shadow-lg relative space-y-10 max-w-md">
				<div className="w-full flex flex-col items-center space-y-8">
					<div className="relative">
						<Image
							src="https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
							alt="User Profile"
							width={230}
							height={230}
							className="rounded-full border-4 border-white object-cover"
						/>
					</div>
					<div className="text-center space-y-2">
						<h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
						<p className="text-gray-600">{formatRut(user?.id.toString() || "")}</p>
						<p className="text-gray-500">{user?.email}</p>
						<p className="text-gray-600 font-semibold">{localStorage.getItem("SELECTED_ROLE")}</p>
					</div>
				</div>

				<button
					onClick={() => showModal("Update", selectedProfile)}
					className="bg-green-800 text-white py-3 px-8 rounded-lg mt-6"
				>
					Actualizar
				</button>
				<Form
					modalTitle="Actualizar Perfil"
					entityName="usuario"
					visible={isModalOpen && modalType === "Update"}
					onCancel={handleCancel}
					onOk={handleOk}
					data={[]}
					setData={() => {}}
					apiEndpoint={`/dashboard/administrators/${user?.id}`}
					method="PATCH"
					formContext={formContext as any}
				>
					<Input
						label="Nombre"
						type="text"
						placeholder="Nombre"
						error={errors.name ? errors.name.message?.toString() : ""}
						{...register("name")}
					/>
					<Input
						label="Correo Electrónico"
						type="email"
						placeholder="Correo Electrónico"
						error={errors.email ? errors.email.message?.toString() : ""}
						{...register("email")}
					/>

					<Input
						label="Contraseña"
						type="password"
						placeholder="••••"
						islogin="false"
						error={errors.password ? errors.password.message?.toString() : ""}
						{...register("password")}
					/>

					<Input
						label="Confirmar Contraseña"
						type="password"
						placeholder="••••"
						islogin="false"
						error={errors.confirmPassword ? errors.confirmPassword.message?.toString() : ""}
						{...register("confirmPassword")}
					/>
					<InputFile
						label="Imagen"
						{...register("image")}
						error={errors.image ? errors.image.message?.toString() : ""}
					/>
				</Form>
			</div>
		</div>
	)
}

export default ProfilePage
