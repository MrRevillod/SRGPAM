import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ServiceSchemas } from "../../../lib/schemas"
import { useForm } from "react-hook-form"
import { CreateEntityFormProps, Service } from "../../../lib/types"

const CreateService: React.FC<CreateEntityFormProps<Service>> = ({ visible, onCancel, onOk, data, setData }) => {
	const formContext = useForm({
		resolver: zodResolver(ServiceSchemas.Create),
	})

	const {
		register,
		formState: { errors },
	} = formContext

	return (
		<Form
			modalTitle="Añadir nuevo servicio al sistema"
			entityName="servicio"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint="/dashboard/services/"
			formContext={formContext as any}
			method="POST"
		>
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
		</Form>
	)
}

export default CreateService
