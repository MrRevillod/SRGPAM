import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CentersSchemas } from "../../../lib/schemas"
import { Center, UpdateEntityFormProps } from "../../../lib/types"

const UpdateCenter: React.FC<UpdateEntityFormProps<Center>> = ({ visible, entity, onCancel, onOk, data, setData }) => {
	const formContext = useForm({
		resolver: zodResolver(CentersSchemas.Update),
		defaultValues: {
			name: entity?.name,
			address: entity?.address,
			phone: entity?.phone,
			image: null,
		},
	})

	const {
		register,
		formState: { errors },
	} = formContext

	return (
		<Form
			modalTitle={`Editar la información del centro ${entity?.name}`}
			entityName="centro de atención"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint={`/dashboard/centers/${entity?.id}`}
			formContext={formContext as any}
			method="PATCH"
		>
			<Input
				label="Nombre"
				type="text"
				error={errors.name ? errors.name.message?.toString() : ""}
				defaultValue={entity?.name}
				{...register("name")}
			/>
			<Input
				label="Dirección"
				type="text"
				error={errors.address ? errors.address.message?.toString() : ""}
				defaultValue={entity?.address}
				{...register("address")}
			/>
			<Input
				label="Teléfono"
				type="text"
				error={errors.phone ? errors.phone.message?.toString() : ""}
				defaultValue={entity?.phone}
				{...register("phone")}
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

export default UpdateCenter
