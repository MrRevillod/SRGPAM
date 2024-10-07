import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfessionalSchemas } from "../../../lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { FormProps, Professional } from "../../../lib/types"

const CreateProfessional: React.FC<FormProps<Professional>> = ({ data, setData }) => {
	const methods = useForm({ resolver: zodResolver(ProfessionalSchemas.Create) })

	return (
		<Modal type="Create" title="Añadir nuevo profesional al sistema">
			<FormProvider {...methods}>
				<Form
					entityName="profesional"
					data={data}
					setData={setData}
					apiEndpoint="/dashboard/professional/"
					method="POST"
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="JohnD@provider.com" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateProfessional
