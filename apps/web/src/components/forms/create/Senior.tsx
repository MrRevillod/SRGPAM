import React from "react"
import Form from "../Form"
import ReactDatePicker from "react-datepicker"

import { es } from "date-fns/locale/es"
import { Input } from "../../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../../lib/schemas"
import { registerLocale } from "react-datepicker"
import { useForm, Controller } from "react-hook-form"
import { CreateEntityFormProps, Senior } from "../../../lib/types"

registerLocale("es", es)

import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "../../ui/InputDate"

const CreateSenior: React.FC<CreateEntityFormProps<Senior>> = ({ visible, onCancel, onOk, data, setData }) => {
	const formContext = useForm({ resolver: zodResolver(SeniorSchemas.DashboardRegister) })

	const {
		control,
		register,
		formState: { errors },
	} = formContext

	return (
		<Form
			modalTitle="Añadir nueva persona mayor al sistema"
			entityName="persona mayor"
			onOk={onOk}
			data={data}
			setData={setData}
			visible={visible}
			onCancel={onCancel}
			apiEndpoint="/dashboard/seniors/pre-checked"
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

			<Input
				label="Dirección"
				type="text"
				{...register("address")}
				placeholder="Montt #123"
				error={errors.address ? errors.address.message?.toString() : ""}
			/>

			<DatePicker
				label="Fecha de nacimiento"
				control={control}
				name="birthDate"
				error={errors.birthDate ? errors.birthDate.message?.toString() : ""}
			/>
		</Form>
	)
}

export default CreateSenior
