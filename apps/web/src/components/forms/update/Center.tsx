import React, { useEffect } from "react"
import Form from "../Form"

import { Input } from "../../ui/Input"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CentersSchemas } from "../../../lib/schemas"
import { Center, FormProps } from "../../../lib/types"
import { InputFile } from "../../ui/InputFile"
import { useModal } from "../../../context/ModalContext"
import { Modal } from "../../Modal"

const UpdateCenter: React.FC<FormProps<Center>> = ({ data, setData }) => {
	const { selectedData } = useModal()

	const methods = useForm({
		resolver: zodResolver(CentersSchemas.Update),
	})

	const { reset } = methods

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				address: selectedData.address,
				phone: selectedData.phone,
				image: null,
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información del ${selectedData?.name}`}>
			<FormProvider {...methods}>
				<Form
					entityName="centro de atención"
					data={data}
					setData={setData}
					apiEndpoint={`/dashboard/centers/${selectedData?.id}`}
					method="PATCH"
				>
					<Input name="name" label="Nombre" type="text" />
					<Input name="address" label="Dirección" type="text" />
					<Input name="phone" label="Teléfono" type="text" />
					<InputFile name="image" label="Imagen" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateCenter
