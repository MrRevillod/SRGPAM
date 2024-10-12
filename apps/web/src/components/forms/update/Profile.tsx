import React from "react"

import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { useAuth } from "../../../context/AuthContext"
import { ImageCrop } from "../../ImageCrop"
import { useMutation } from "../../../hooks/useMutation"
import { zodResolver } from "@hookform/resolvers/zod"
import { message, UploadFile } from "antd"
import { UpdateResponse, User } from "../../../lib/types"
import { AdministratorSchemas } from "../../../lib/schemas"
import { buildRequestBody, handleFormError } from "../../../lib/form"
import { updateAdministrator, updateProfessional } from "../../../lib/actions"
import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form"

interface UpdateProfileProps {
	setImageSrc: Dispatch<SetStateAction<string>>
	setShowUpdateForm: Dispatch<SetStateAction<boolean>>
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ setImageSrc, setShowUpdateForm }) => {
	const { user, setUser, role } = useAuth()
	const [imageFile, setImageFile] = useState<UploadFile | null>(null)

	const methods = useForm({ resolver: zodResolver(AdministratorSchemas.Update) })
	const { reset, handleSubmit, setError } = methods

	const handleReset = () => {
		reset({
			name: user?.name,
			email: user?.email,
			password: "",
			confirmPassword: "",
		})
		setImageFile(null)
	}

	const handleCancel = () => {
		setShowUpdateForm(false)
		handleReset()
	}

	useEffect(() => {
		if (user) handleReset()
	}, [user])

	const mutation = useMutation<UpdateResponse<User>>({
		mutateFn: role === "ADMIN" ? updateAdministrator : updateProfessional,
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		const body = buildRequestBody({ ...formData, image: imageFile })

		await mutation.mutate({
			params: { id: user?.id, body },
			onSuccess: (data) => {
				setUser(data.updated)
				if (data.image) setImageSrc(data.image)
				message.success("Hecho")
				handleReset()
			},
			onError: (error) => {
				message.error(error)
				if (error?.conflicts) {
					handleFormError(error, setError)
				}
			},
		})
	}

	return (
		<FormProvider {...methods}>
			<div className="w-full mb-4">
				<h3 className="font-semibold text-start text-xl text-dark dark:text-light">
					Editar información del perfil
				</h3>
			</div>

			<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
				<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />

				<Input name="password" label="Contraseña" type="password" placeholder="••••••••" />
				<Input name="confirmPassword" label="Confirmar contraseña" type="password" placeholder="••••••••" />

				<ImageCrop imageLabel="Imagen de perfil" setImageFile={setImageFile} />

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
