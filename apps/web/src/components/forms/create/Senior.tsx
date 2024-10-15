import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { DatePicker } from "../../ui/InputDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { createSenior } from "../../../lib/actions"
import { SeniorSchemas } from "../../../lib/schemas"
import { FormProps, Senior } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const CreateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const methods = useForm({ resolver: zodResolver(SeniorSchemas.DashboardRegister) })

	return (
		<Modal type="Create" title="Añadir nueva persona mayor al sistema">
			<FormProvider {...methods}>
				<Form<Senior> data={data} setData={setData} action={createSenior} actionType="create">
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
