import React from "react"
import { api } from "../../lib/axios"
import { Input } from "../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { CentersSchemas } from "../../lib/schemas"
import { Modal, message } from "antd"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

interface CreateCenterProps {
	visible: boolean
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: (data: any[]) => void
}

type FormValues = {
	id: string
	name: string
	address: string
	phone: string
	image: any
}

const CreateCenter: React.FC<CreateCenterProps> = ({ visible, onCancel, onOk, data, setData }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(CentersSchemas.Create),
	})

	const handleCancel = () => {
		reset()
		onCancel()
	}

	const onSubmit: SubmitHandler<FormValues> = async (form) => {
		try {
			console.log(form)
			const formData = new FormData()
			formData.append("id", form.id)
			formData.append("name", form.name)
			formData.append("address", form.address)
			formData.append("phone", form.phone)
			formData.append("image", form.image[0])
			const res = await api.post("/dashboard/centers/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})

			setData([...data, res.data.values.center])
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
							message: `Este Centro ya se encuentra registrado`,
						})
					})
					console.log(error.response.data.values.conflicts)
				}

				return
			}

			message.error("Error al crear el centro. Intente nuevamente")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal title="Añadir centro de atención al sistema" open={visible} onCancel={onCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
				<Input
					label="Nombre "
					type="text"
					{...register("name")}
					placeholder="Nombre del Centro"
					error={errors.name ? errors.name.message?.toString() : ""}
				/>
				<Input
					label="Dirección"
					type="text"
					{...register("address")}
					placeholder="Pedro Montt #41"
					error={errors.address ? errors.address.message?.toString() : ""}
				/>
				<Input
					label="Teléfono"
					type="text"
					{...register("phone")}
					placeholder="56955473897"
					error={errors.phone ? errors.phone.message?.toString() : ""}
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

export default CreateCenter
