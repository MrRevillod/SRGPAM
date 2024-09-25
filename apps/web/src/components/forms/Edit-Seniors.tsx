import React, { useEffect } from "react"
import { api } from "../../lib/axios"
import { Input } from "../ui/Input"
import { InputDate } from "../ui/InputDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../lib/schemas"
import { Modal, message } from "antd"
import { SubmitHandler, useForm } from "react-hook-form"
import type { DataType, PasswordFields, Senior } from "../../lib/types"
import { SetStateAction, Dispatch } from "react"

interface ModalProps {
	visible: boolean
	person: DataType | null
	modalType: string
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: Dispatch<SetStateAction<DataType[]>>
}

type FormValues = Partial<Senior> & PasswordFields

const EditPersonModal: React.FC<ModalProps> = ({ visible, person, onCancel, onOk, data, setData }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
		reset,
		clearErrors,
	} = useForm({
		resolver: zodResolver(SeniorSchemas.Update),
	})

	useEffect(() => {
		if (person) {
			reset({
				name: person.name,
				email: person.email,
				address: person.address,
				birthDate: person.birthDate,
				password: "",
				confirmPassword: "",
			})
		}
	}, [person, reset])

	const handleCancel = () => {
		reset()
		clearErrors()
		onCancel()
	}

	const handleDelete = async () => {
		try {
			if (person?.id) {
				await api.delete(`/dashboard/seniors/${person.id}`)
				message.success("Persona eliminada correctamente")

				const updatedData = data.filter((item) => item.id !== person.id)
				setData(updatedData)

				onOk()
			} else {
				message.error("No se pudo encontrar el ID de la persona")
			}
		} catch (error) {
			message.error("Error al eliminar la persona")
			console.error("Error en el delete:", error)
		}
	}

	const onSubmit: SubmitHandler<FormValues> = async (form) => {
		try {
			const res = await api.patch(`/dashboard/seniors/${person?.id}`, {
				name: form.name,
				email: form.email,
				address: form.address,
				birthDate: new Date(form.birthDate as string).toISOString(),
				password: form.password,
				confirmPassword: form.confirmPassword,
			})

			const updatedUser = res.data.values.senior
			const updatedData = data.map((senior) => {
				if (senior.id === updatedUser.id) {
					return updatedUser
				}
				return senior
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
			message.error("Error al actualizar el Adulto Mayor. Intente nuevamente")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal title={`Actualizar la información de ${person?.name}`} open={visible} onCancel={onCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit as any)}>
				<Input
					label="Nombre"
					type="text"
					placeholder="Nombre"
					error={errors.name ? errors.name.message?.toString() : ""}
					defaultValue={person?.name}
					{...register("name")}
				/>
				<Input
					label="Correo Electrónico"
					type="email"
					placeholder="Correo Electrónico"
					error={errors.email ? errors.email.message?.toString() : ""}
					defaultValue={person?.email}
					{...register("email")}
				/>
				<Input
					label="Dirección"
					type="text"
					placeholder="Dirección"
					error={errors.address ? errors.address.message?.toString() : ""}
					defaultValue={person?.address}
					{...register("address")}
				/>
				<InputDate
					label="Fecha de Nacimiento"
					value={person?.birthDate}
					{...register("birthDate")}
					error={errors.birthDate ? errors.birthDate.message?.toString() : ""}
				/>
				<Input
					label="PIN"
					type="password"
					placeholder="••••"
					islogin="false"
					error={errors.password ? errors.password.message?.toString() : ""}
					{...register("password")}
				/>
				<Input
					label="Confirmar PIN"
					type="password"
					placeholder="••••"
					islogin="false"
					error={errors.confirmPassword ? errors.confirmPassword.message?.toString() : ""}
					{...register("confirmPassword")}
				/>

				<div className="flex flex-row gap-4 w-full justify-end -mb-6">
					<button
						key="back"
						onClick={() => handleCancel()}
						className="text-red-700 border-red-700 border-1 font-semibold px-6 py-2 rounded-lg"
					>
						Cancelar
					</button>
					<button
						key="delete"
						onClick={handleDelete}
						className="bg-red-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg"
					>
						Eliminar
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

export default EditPersonModal
