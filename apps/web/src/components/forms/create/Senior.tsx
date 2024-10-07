import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { FormProps, Senior } from "../../../lib/types"

import { DatePicker } from "../../ui/InputDate"
import { Modal } from "../../Modal"

const CreateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const methods = useForm({ resolver: zodResolver(SeniorSchemas.DashboardRegister) })

	return (
		<Modal type="Create" title="Añadir nueva persona mayor al sistema">
			<FormProvider {...methods}>
				<Form
					entityName="persona mayor"
					data={data}
					setData={setData}
					apiEndpoint="/dashboard/seniors/pre-checked"
					method="POST"
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
					<Input name="address" label="Dirección" type="text" placeholder="Montt #123" />
					<DatePicker label="Fecha de nacimiento" name="birthDate" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateSenior
