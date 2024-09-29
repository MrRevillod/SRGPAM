import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ServiceSchemas } from "../../../lib/schemas"
import { Service, UpdateEntityFormProps } from "../../../lib/types"

const UpdateService: React.FC<UpdateEntityFormProps<Service>> = (props) => {
	const { visible, onCancel, onOk, data, setData, entity } = props

	const formContext = useForm({
		resolver: zodResolver(ServiceSchemas.Update),
	})

	const {
		register,
		formState: { errors },
		reset,
	} = formContext

	useEffect(() => {
		if (entity) {
			reset({
				name: entity.name,
				title: entity.title,
				description: entity.description,
			})
		}
	}, [entity])

	return (
		<Form
			modalTitle={`Actualizar la información de ${entity?.name}`}
			entityName="servicio"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint={`/dashboard/services/${entity?.id}`}
			formContext={formContext as any}
			method="PATCH"
		>
			<Input
				label="Nombre"
				type="text"
				placeholder="Nombre del servicio"
				error={errors.name ? errors.name.message?.toString() : ""}
				defaultValue={entity?.name}
				{...register("name")}
			/>
			<Input
				label="Servicio"
				type="text"
				placeholder="Título del servicio"
				error={errors.title ? errors.title.message?.toString() : ""}
				defaultValue={entity?.title}
				{...register("title")}
			/>
			<Input
				label="Descripción"
				type="text"
				placeholder="Descripción del Servicio"
				error={errors.description ? errors.description.message?.toString() : ""}
				defaultValue={entity?.description}
				{...register("description")}
			/>
		</Form>
	)
}

export default UpdateService
