import React from "react"
import Form from "../Form"
import DatePicker from "../../ui/InputDate"

import { Input } from "../../ui/Input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../../lib/schemas"
import { Senior, UpdateEntityFormProps } from "../../../lib/types"

const UpdateSenior: React.FC<UpdateEntityFormProps<Senior>> = ({ visible, entity, onCancel, onOk, data, setData }) => {
	const formContext = useForm({
		resolver: zodResolver(SeniorSchemas.Update),
	})

	const {
		reset,
		control,
		register,
		formState: { errors },
	} = formContext

	useEffect(() => {
		if (entity) {
			reset({
				name: entity.name,
				email: entity.email,
				address: entity.address,
				birthDate: entity.birthDate,
				password: "",
				confirmPassword: "",
			})
		}
	}, [entity])

	return (
		<Form
			modalTitle={`Editar la información de ${entity?.name}`}
			entityName="persona mayor"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint={`/dashboard/seniors/${entity?.id}`}
			formContext={formContext as any}
			method="PATCH"
		>
			<Input
				label="Nombre"
				type="text"
				placeholder="Nombre"
				error={errors.name ? errors.name.message?.toString() : ""}
				defaultValue={entity?.name}
				{...register("name")}
			/>
			<Input
				label="Correo Electrónico"
				type="email"
				placeholder="Correo Electrónico"
				error={errors.email ? errors.email.message?.toString() : ""}
				defaultValue={entity?.email}
				{...register("email")}
			/>
			<Input
				label="Dirección"
				type="text"
				placeholder="Dirección"
				error={errors.address ? errors.address.message?.toString() : ""}
				defaultValue={entity?.address}
				{...register("address")}
			/>

			<DatePicker
				label="Fecha de nacimiento"
				control={control}
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
		</Form>
	)
}

export default UpdateSenior
