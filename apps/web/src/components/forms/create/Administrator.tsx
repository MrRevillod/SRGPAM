import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdministratorSchemas } from "../../../lib/schemas"
import { useForm } from "react-hook-form"
import { CreateEntityFormProps, Administrator } from "../../../lib/types"

const CreateAdministrator: React.FC<CreateEntityFormProps<Administrator>> = ({
	visible,
	onCancel,
	onOk,
	data,
	setData,
}) => {
	const formContext = useForm({ resolver: zodResolver(AdministratorSchemas.Create) })

	const {
		control,
		register,
		formState: { errors },
	} = formContext

	return (
		<Form
			modalTitle="Añadir nuevo administrador al sistema"
			entityName="administrador"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint="/dashboard/administrators/"
			formContext={formContext as any}
			method="POST"
		>
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
		</Form>
	)
}

export default CreateAdministrator
