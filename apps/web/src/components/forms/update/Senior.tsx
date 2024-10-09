import React from "react"
import Form from "../Form"

import { Modal } from "../../Modal"
import { Input } from "../../ui/Input"
import { useModal } from "../../../context/ModalContext"
import { useEffect } from "react"
import { DatePicker } from "../../ui/InputDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { SeniorSchemas } from "../../../lib/schemas"
import { Senior, FormProps } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const UpdateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const { selectedData } = useModal()

	const methods = useForm({
		resolver: zodResolver(SeniorSchemas.Update),
	})

	const { reset } = methods

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				email: selectedData.email,
				address: selectedData.address,
				birthDate: new Date(selectedData.birthDate),
				password: "",
				confirmPassword: "",
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`}>
			<FormProvider {...methods}>
				<Form
					entityName="persona mayor"
					data={data}
					setData={setData}
					apiEndpoint={`/dashboard/seniors/${selectedData?.id}`}
					method="PATCH"
				>
					<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />
					<Input name="address" label="Dirección" type="text" placeholder="Dirección" />
					<DatePicker name="birthDate" label="Fecha de nacimiento" />
					<Input name="password" label="PIN" type="password" placeholder="••••" />
					<Input name="confirmPassword" label="Confirmar PIN" type="password" placeholder="••••" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateSenior
