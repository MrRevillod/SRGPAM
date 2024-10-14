import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { createService } from "../../../lib/actions"
import { ServiceSchemas } from "../../../lib/schemas"
import { ImageSelector2 } from "../../ImageSelector2"
import { FormProps, Service } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const CreateService: React.FC<FormProps<Service>> = ({ data, setData }) => {
	const methods = useForm({
		resolver: zodResolver(ServiceSchemas.Create),
	})

	return (
		<Modal type="Create" title="Añadir nuevo servicio al sistema">
			<FormProvider {...methods}>
				<Form<Service> data={data} setData={setData} action={createService} actionType="create">
					<Input name="name" label="Nombre del Servicio" type="text" placeholder="Nombre del servicio" />
					<Input name="title" label="Título del Servicio" type="text" placeholder="Abogados" />
					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="Descripción breve del servicio"
					/>
					<ImageSelector2 imageLabel="Imagen" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default CreateService
