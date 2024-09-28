import React, { useEffect } from "react"
import { api } from "../../lib/axios"
import { Input } from "../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { CentersSchemas } from "../../lib/schemas"
import { Modal, message } from "antd"
import { SubmitHandler, useForm } from "react-hook-form"
import type { Center, DataType, Service } from "../../lib/types"
import { SetStateAction, Dispatch } from "react"

interface ModalProps {
	visible: boolean
	center: Center | null
	modalType: string
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: Dispatch<SetStateAction<DataType[]>>
}

type FormValues = {
	name: string
	address: string
	phone: string
	image: any
}

const EditCenterModal: React.FC<ModalProps> = ({ visible, center, onCancel, onOk, data, setData }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
		clearErrors,
		control,
	} = useForm({
		resolver: zodResolver(CentersSchemas.Update),
	})

	useEffect(() => {
		if (center) {
			reset({
				name: center.name,
				address: center.address,
				phone: center.phone,
			})
		}
	}, [center, reset])

	const handleCancel = () => {
		reset()
		clearErrors()
		onCancel()
	}

	const onSubmit: SubmitHandler<FormValues> = async (form) => {
		try {
			const res = await api.patch(`/dashboard/centers/${center?.id}`, {
				name: form.name,
				address: form.address,
				phone: form.phone,
			})

			const updatedUser = res.data.values.center
			const updatedData = data.map((center) => {
				if (center.id === updatedUser.id) {
					return updatedUser
				}
				return center
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
			message.error("Error al actualizar el Centro. Intente nuevamente")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal title={`Actualizar la información de ${center?.name}`} open={visible} onCancel={onCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit as any)}>
				<Input
					label="Nombre"
					type="text"
					placeholder="Nombre del nuevo centro"
					error={errors.name ? errors.name.message?.toString() : ""}
					defaultValue={center?.name}
					{...register("name")}
				/>
				<Input
					label="Direccion del Centro"
					type="text"
					placeholder="Direccion del nuevo Centro"
					error={errors.address ? errors.address.message?.toString() : ""}
					defaultValue={center?.address}
					{...register("address")}
				/>
				<Input
					label="Teléfono del centro"
					type="text"
					placeholder="Nuevo teléfono del centro"
					error={errors.phone ? errors.phone.message?.toString() : ""}
					defaultValue={center?.phone}
					{...register("phone")}
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

export default EditCenterModal
