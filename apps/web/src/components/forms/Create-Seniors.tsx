import React from "react"
import { api } from "../../lib/axios"
import { Input } from "../ui/Input"
import { InputDate } from "../ui/InputDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../lib/schemas"
import { Modal, message } from "antd"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

interface CreateSeniorsProps {
	visible: boolean
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: (data: any[]) => void
}

type FormValues = {
	id: string
	email: string
	name: string
	address: string
	birthDate: string
}

const CreateSeniors: React.FC<CreateSeniorsProps> = ({ visible, onCancel, onOk, data, setData }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
		clearErrors,
	} = useForm({
		resolver: zodResolver(SeniorSchemas.DashboardRegister),
	})

	const handleCancel = () => {
		clearErrors()
		reset()
		onCancel()
	}

	const onSubmit: SubmitHandler<FormValues> = async (form) => {
		try {
			const res = await api.post("/dashboard/seniors/pre-checked/", {
				id: form.id,
				email: form.email,
				name: form.name,
				address: form.address,
				birthDate: form.birthDate,
			})

			setData([...data, res.data.values.senior])
			message.success(res.data.message)
			onOk()
		} catch (error: any) {
			if (error.response) {
				message.error(error.response.data.message)

				if (error.response.status === 409) {
					error.response.data.values.conflicts.forEach((element: string) => {
						setError(element, {
							type: "manual",
							message: `El ${element === "id" ? "rut" : element} ya existe en el sistema`,
						})
					})
				}

				return
			}

			message.error("Error al crear el Adulto Mayor. Intente nuevamente")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal title="Añadir adulto mayor al sistema" open={visible} onCancel={onCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
				<Input
					label="Rut (sin puntos ni guión)"
					type="text"
					{...register("id")}
					placeholder="123456789"
					error={errors.id ? errors.id.message?.toString() : ""}
				/>
				<Input
					label="Nombre"
					type="text"
					{...register("name")}
					placeholder="Juan Perez"
					error={errors.name ? errors.name.message?.toString() : ""}
				/>

				<Input
					label="Correo Electrónico"
					type="email"
					{...register("email")}
					placeholder="JohnD@provider.com"
					error={errors.email ? errors.email.message?.toString() : ""}
				/>

				<Input
					label="Dirección"
					type="text"
					{...register("address")}
					placeholder="Montt 123"
					error={errors.address ? errors.address.message?.toString() : ""}
				/>

				<InputDate
					label="Fecha de Nacimiento"
					{...register("birthDate")}
					error={errors.birthDate ? errors.birthDate.message?.toString() : ""}
				/>

				<div className="flex flex-row gap-4 w-full justify-end -mb-6">
					<button
						key="back"
						onClick={() => handleCancel()}
						className="bg-red-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg"
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

export default CreateSeniors
