import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { useModal } from "../../../context/ModalContext"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateService } from "../../../lib/actions"
import { ServiceSchemas } from "../../../lib/schemas"
import { ImageSelector2 } from "../../ImageSelector2"
import { Service, FormProps } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const UpdateService: React.FC<FormProps<Service>> = ({ data, setData }) => {
	const { selectedData } = useModal()

	const methods = useForm({
		resolver: zodResolver(ServiceSchemas.Update),
	})

	const { reset } = methods

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				title: selectedData.title,
				description: selectedData.description,
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`}>
			<FormProvider {...methods}>
				<Form<Service> data={data} setData={setData} action={updateService} actionType="update">
					<Input name="name" label="Nombre" type="text" placeholder="Psicología" />
					<Input name="title" label="Servicio" type="text" placeholder="Psicólogo(a)" />
					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="¿En qué consiste el servicio?"
					/>
					<ImageSelector2 imageLabel="Imagen" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateService
