import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdministratorSchemas } from "../../../lib/schemas"
import { Administrator, UpdateEntityFormProps } from "../../../lib/types"

const UpdateAdministrator: React.FC<UpdateEntityFormProps<Administrator>> = ({
	visible,
	entity,
	onCancel,
	onOk,
	data,
	setData,
}) => {
	const formContext = useForm({
		resolver: zodResolver(AdministratorSchemas.Update),
	})

	const {
		reset,
		register,
		formState: { errors },
	} = formContext

	useEffect(() => {
		if (entity) {
			reset({
				name: entity.name,
				email: entity.email,
				password: "",
				confirmPassword: "",
			})
		}
	}, [entity])

	return (
		<Form
			modalTitle={`Editar la información de ${entity?.name}`}
			entityName="administrador"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint={`/dashboard/administrators/${entity?.id}`}
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

export default UpdateAdministrator
