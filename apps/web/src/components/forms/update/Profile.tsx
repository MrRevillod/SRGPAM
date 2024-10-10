import React from "react"

import { api } from "../../../lib/axios"
import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { useAuth } from "../../../context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageEditor } from "../../ImageCrop"
import { LoginVariant, User } from "../../../lib/types"
import { useEffect, useState } from "react"
import { message, UploadFile } from "antd"
import { AdministratorSchemas } from "../../../lib/schemas"
import { buildRequestBody, handleFormError } from "../../../lib/form"
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form"

interface UpdateProfileProps {
	setImageSrc: React.Dispatch<React.SetStateAction<string>>
	setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ setImageSrc, setShowUpdateForm }) => {
	const { user, setUser, role } = useAuth()
	const [imageFile, setImageFile] = useState<UploadFile | null>(null)

	const methods = useForm({
		resolver: zodResolver(AdministratorSchemas.Update),
	})

	const { reset, handleSubmit, setError } = methods

	const handleReset = () => {
		reset({ name: user?.name, email: user?.email, password: "", confirmPassword: "" })
		setImageFile(null)
	}

	useEffect(() => {
		if (user) handleReset()
	}, [user])

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		if (data.name === user?.name && data.email && imageFile === null) {
			message.error("No se han realizado cambios")
			return
		}

		const endpoints = {
			ADMIN: `/dashboard/administrators/${user?.id}`,
			PROFESSIONAL: `/dashboard/professionals/${user?.id}`,
		}

		const body = buildRequestBody({ ...data, image: imageFile })

		try {
			const response = await api.patch(endpoints[role as LoginVariant], body, {
				headers: {
					"Content-Type": imageFile !== null ? "multipart/form-data" : "application/json",
				},
			})

			setImageSrc(response.data.values.image)
			message.success(response.data.message)
			setUser(response.data.values.updated as User)

			handleReset()
		} catch (error: any) {
			handleFormError(error, setError)
		}
	}

	const handleCancel = () => {
		setShowUpdateForm(false)
		handleReset()
	}

	return (
		<FormProvider {...methods}>
			<div className="w-full mb-4">
				<h3 className="font-semibold text-start text-lg">Editar información del perfil</h3>
			</div>

			<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
				<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />

				<Input name="password" label="Contraseña" type="password" placeholder="••••••••" />
				<Input name="confirmPassword" label="Confirmar contraseña" type="password" placeholder="••••••••" />

				<ImageEditor imageLabel="Imagen de perfil" setImageFile={setImageFile} />

				<div className="flex flex-row gap-4 w-full justify-end mt-4">
					<Button variant="secondary" onClick={() => handleCancel()} className="w-1/4" type="button">
						Volver
					</Button>
					<Button type="submit" variant="primary" className="w-1/4">
						Guardar
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}

export default UpdateProfile
