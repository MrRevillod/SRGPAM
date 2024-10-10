import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { InputFile } from "../../ui/InputFile"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCenter } from "../../../lib/actions"
import { CentersSchemas } from "../../../lib/schemas"
import { Center, FormProps } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const CreateCenter: React.FC<FormProps<Center>> = ({ data, setData }) => {
	const methods = useForm({ resolver: zodResolver(CentersSchemas.Create) })

	return (
		<Modal type="Create" title="Añadir nuevo centro de atención al sistema">
			<FormProvider {...methods}>
				<Form data={data} setData={setData} action={createCenter}>
					<Input name="name" label="Nombre" type="text" placeholder="Centro de atención San José" />
					<Input name="address" label="Dirección" type="text" placeholder="Pedro Montt #41" />
					<Input name="phone" label="Teléfono" type="text" placeholder="56955473897" />
					<InputFile name="image" label="Imagen" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateCenter
