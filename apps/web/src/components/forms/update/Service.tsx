import React from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { FormProvider, useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ServiceSchemas } from "../../../lib/schemas"
import { Service, FormProps } from "../../../lib/types"
import { InputFile } from "../../ui/InputFile"
import { useModal } from "../../../context/ModalContext"
import { Modal } from "../../Modal"

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
				<Form
					entityName="servicio"
					data={data}
					setData={setData}
					apiEndpoint={`/dashboard/services/${selectedData?.id}`}
					method="PATCH"
				>
					<Input name="name" label="Nombre" type="text" placeholder="Psicología" />
					<Input name="title" label="Servicio" type="text" placeholder="Psicólogo(a)" />
					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="¿En qué consiste el servicio?"
					/>
					<InputFile name="image" label="Imagen" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateService
