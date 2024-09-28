import React, { useEffect } from "react"
import { api } from "../../lib/axios"
import { Input } from "../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ServiceSchemas } from "../../lib/schemas"
import { Modal, message } from "antd"
import { SubmitHandler, useForm } from "react-hook-form"
import type { DataType, Service } from "../../lib/types"
import { SetStateAction, Dispatch } from "react"

interface ModalProps {
	visible: boolean
	service: Service | null
	modalType: string
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: Dispatch<SetStateAction<DataType[]>>
}

type FormValues = {
	name: string
	title: string
	description: string
	image: any
}

const EditServiceModal: React.FC<ModalProps> = ({ visible, service, onCancel, onOk, data, setData }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
		clearErrors,
		control,
	} = useForm({
		resolver: zodResolver(ServiceSchemas.Update),
	})

	useEffect(() => {
		if (service) {
			reset({
				name: service.name,
				title: service.title,
				description: service.description,
			})
		}
	}, [service, reset])

	const handleCancel = () => {
		reset()
		clearErrors()
		onCancel()
	}

	const onSubmit: SubmitHandler<FormValues> = async (form) => {
		try {
			const res = await api.patch(`/dashboard/services/${service?.id}`, {
				name: form.name,
				title: form.title,
				description: form.description,
			})

			const updatedUser = res.data.values.service
			const updatedData = data.map((service) => {
				if (service.id === updatedUser.id) {
					return updatedUser
				}
				return service
			})

			setData(updatedData)
			reset()
			onOk()
		} catch (error: any) {
			if (error.response) {
				message.error(error.response.data.message)

				if (error.response.status === 409) {
					error.response.data.values.conflicts.forEach((element: string) => {
						setError(element, {
							type: "manual",
							message: `El ${element} ya existe en el sistema`,
						})
					})
				}

				return
			}
			message.error("Error al actualizar el Servicio. Intente nuevamente")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal title={`Actualizar la información de ${service?.name}`} open={visible} onCancel={onCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit as any)}>
				<Input
					label="Nombre"
					type="text"
					placeholder="Nombre del servicio"
					error={errors.name ? errors.name.message?.toString() : ""}
					defaultValue={service?.name}
					{...register("name")}
				/>
				<Input
					label="Servicio"
					type="text"
					placeholder="Título del servicio"
					error={errors.title ? errors.title.message?.toString() : ""}
					defaultValue={service?.title}
					{...register("title")}
				/>
				<Input
					label="Descripción"
					type="text"
					placeholder="Descripción del Servicio"
					error={errors.description ? errors.description.message?.toString() : ""}
					defaultValue={service?.description}
					{...register("description")}
				/>

				<div className="flex flex-row gap-4 w-full justify-end -mb-6">
					<button
						key="back"
						onClick={() => handleCancel()}
						className="text-red-700 border-1 border-red-700 font-semibold px-6 py-2 rounded-lg"
					>
						Cancelar
					</button>
					<button
						key="submit"
						type="submit"
						className="bg-green-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg"
					>
						Guardar
					</button>
				</div>
			</form>
		</Modal>
	)
}

export default EditServiceModal
