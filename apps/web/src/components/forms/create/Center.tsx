import React from "react"
import Form from "../Form"
import InputFile from "../../ui/InputFile"

import { Input } from "../../ui/Input"
import { CentersSchemas } from "../../../lib/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Center, CreateEntityFormProps } from "../../../lib/types"

const CreateCenter: React.FC<CreateEntityFormProps<Center>> = ({ visible, onCancel, onOk, data, setData }) => {
	const formContext = useForm({ resolver: zodResolver(CentersSchemas.Create) })

	const {
		register,
		formState: { errors },
	} = formContext

	return (
		<Form
			modalTitle="Añadir nuevo centro de atención al sistema"
			entityName="centro de atención"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint="/dashboard/centers/"
			formContext={formContext as any}
			method="POST"
		>
			<Input
				label="Nombre"
				type="text"
				{...register("name")}
				placeholder="Centro de atención San José"
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

			<InputFile
				label="Imagen"
				{...register("image")}
				error={errors.image ? errors.image.message?.toString() : ""}
			/>
		</Form>
	)
}

export default CreateCenter
