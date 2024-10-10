import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdministratorSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { FormProps, Administrator } from "../../../lib/types"
import { createAdministrator } from "../../../lib/actions"

const CreateAdministrator: React.FC<FormProps<Administrator>> = ({ data, setData }) => {
	const methods = useForm({ resolver: zodResolver(AdministratorSchemas.Create) })

	return (
		<Modal type="Create" title="Añadir nuevo administrador al sistema">
			<FormProvider {...methods}>
				<Form data={data} setData={setData} action={createAdministrator}>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateAdministrator
