import React from "react"
import { api } from "../../lib/axios"
import { Input } from "../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ServiceSchemas } from "../../lib/schemas"
import { Modal, message } from "antd"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

interface CreateServiceProps {
	visible: boolean
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: (data: any[]) => void
}

type FormValues = {
	id: string
	name: string
	title: string
	description: string
	image: any
}

const CreateService: React.FC<CreateServiceProps> = ({ visible, onCancel, onOk, data, setData }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(ServiceSchemas.Create),
	})

	const handleCancel = () => {
		reset()
		onCancel()
	}

	const onSubmit: SubmitHandler<FormValues> = async (form) => {
		try {
			const formData = new FormData()
			formData.append("id", form.id)
			formData.append("name", form.name)
			formData.append("title", form.title)
			formData.append("description", form.description)
			formData.append("image", form.image[0])
			const res = await api.post("/dashboard/services/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})

			setData([...data, res.data.values.service])
			message.success(res.data.message)
			reset()
			onOk()
		} catch (error: any) {
			if (error.response) {
				message.error(error.response.data.message)

				if (error.response.status === 409) {
					error.response.data.values.conflicts.forEach((element: string) => {
						setError(element, {
							type: "manual",
							message: `Este servicio ya se encuentra registrado`,
						})
					})
					console.log(error.response.data.values.conflicts)
				}

				return
			}

			message.error("Error al crear el servicio. Intente nuevamente")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal title="Añadir servicio al sistema" open={visible} onCancel={onCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
				<Input
					label="Nombre del Servicio"
					type="text"
					{...register("name")}
					placeholder="Nombre del servicio"
					error={errors.name ? errors.name.message?.toString() : ""}
				/>
				<Input
					label="Título del Servicio"
					type="text"
					{...register("title")}
					placeholder="Abogados"
					error={errors.title ? errors.title.message?.toString() : ""}
				/>
				<Input
					label="Descripción"
					type="text"
					{...register("description")}
					placeholder="Descripción breve del servicio"
					error={errors.description ? errors.description.message?.toString() : ""}
				/>
				<input
					type="file"
					{...register("image")}
					className="border p-2"
					accept="image/jpeg,image/png,image/jpg,image/webp"
				/>

				<div className="flex flex-row gap-4 w-full justify-end -mb-6">
					<button
						key="back"
						onClick={() => handleCancel()}
						className="border-1 border-red-700 text-red-700 font-semibold px-6 py-2 rounded-lg"
					>
						Cancelar
					</button>
					<button type="submit" className="bg-green-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg">
						Confirmar
					</button>
				</div>
			</form>
		</Modal>
	)
}

export default CreateService
