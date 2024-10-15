import React from "react"

import { api } from "../../lib/axios"
import { Button } from "../ui/Button"
import { message } from "antd"
import { useModal } from "../../context/ModalContext"
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"
import { buildRequestBody, handleConflicts } from "../../lib/form"
import { Show } from "../ui/Show"

interface FormProps {
	entityName: string
	data: any[]
	setData: (data: any[]) => void
	apiEndpoint: string
	children: React.ReactNode
	method: "POST" | "PATCH"
	deleteable?: boolean 
}

const   Form: React.FC<FormProps> = ({ entityName, data, setData, apiEndpoint, children, method, deleteable }) => {
	const { handleOk, handleCancel, setSelectedData, handleDelete } = useModal()
	const { handleSubmit, reset } = useFormContext()

	const onCancel = () => {
		handleCancel()
	}

	const onDelete = () => {
		handleDelete()
	}
	const onSubmit: SubmitHandler<FieldValues> = async (form) => {
		const body = buildRequestBody(form)

		const request = {
			method,
			url: apiEndpoint,
			data: body,
			headers: {
				"Content-Type": form.image ? "multipart/form-data" : "application/json",
			},
		}

		try {
			const res = await api.request(request)

			if (method === "PATCH") {
				const updatedEntity = res.data.values.updated   
				const index = data.findIndex((entity) => entity.id === updatedEntity.id)

				if (index !== -1) {
					const updatedData = [...data]
					updatedData[index] = updatedEntity
					setData(updatedData)
                }
			}

			if (method === "POST") {
				setData([res.data.values, ...data])
			}

			message.success(res.data.message)
			reset()

			handleOk()
		} catch (error: any) {
			if (error.response) {
				message.error(error.response.data.message)
				if (error.response.status === 409) {
					handleConflicts(entityName, error.response.data.values.conflicts)
				}

				return
			}

			console.log(error)

			message.error("Error. Intente nuevamente.")
		}
	}

	return (
		<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit)}>
			{children}
			<div className="flex flex-row gap-4 w-full justify-end -mb-6">
				{deleteable &&
					<Button type="button" className="justify" variant="delete" onClick={onDelete}>
						Eliminar
					</Button>
				}
				<Button type="button" variant="secondary" onClick={onCancel}>
					Cancelar
				</Button>

				<Button type="submit" variant="primary">
					Guardar
				</Button>
			</div>
		</form>
	)
}

export default Form
