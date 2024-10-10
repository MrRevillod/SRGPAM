import React from "react"

import { Button } from "../ui/Button"
import { message } from "antd"
import { useModal } from "../../context/ModalContext"
import { ApiAction } from "../../lib/types"
import { buildRequestBody, handleFormError } from "../../lib/form"
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"

interface FormProps {
	data: any[]
	setData: (data: any[]) => void
	action: ApiAction
	children: React.ReactNode
}

const Form: React.FC<FormProps> = ({ data, setData, action, children }) => {
	const { handleSubmit, reset, setError } = useFormContext()
	const { handleOk, handleCancel, selectedData } = useModal()

	const onCancel = () => {
		handleCancel()
	}

	const onSubmit: SubmitHandler<FieldValues> = async (form) => {
		console.log(form)

		const { image, ...rest } = form

		const body = buildRequestBody({
			...rest,
			image: form.image ? form.image[0] : undefined,
		})

		console.log(body)

		try {
			const res = await action({
				id: selectedData?.id || null,
				body,
			})

			const method = res.config?.method?.toLowerCase()

			if (method === "patch") {
				const updatedEntity = res.data.values.updated
				const index = data.findIndex((entity) => entity.id === updatedEntity.id)

				if (index !== -1) {
					const updatedData = [...data]
					updatedData[index] = updatedEntity
					setData(updatedData)
				}
			}

			if (method === "post") {
				setData([res.data.values, ...data])
			}

			message.success("Hecho")
			reset()
			handleOk()
		} catch (error: any) {
			handleFormError(error, setError)
		}
	}

	return (
		<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit)}>
			{children}
			<div className="flex flex-row gap-4 w-full justify-end -mb-6">
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

// import React from "react"

// import { api } from "../../lib/axios"
// import { Button } from "../ui/Button"
// import { message } from "antd"
// import { useModal } from "../../context/ModalContext"
// import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"
// import { buildRequestBody, handleConflicts } from "../../lib/form"

// interface FormProps {
// 	entityName: string
// 	data: any[]
// 	setData: (data: any[]) => void
// 	apiEndpoint: string
// 	children: React.ReactNode
// 	method: "POST" | "PATCH"
// }

// const Form: React.FC<FormProps> = ({ entityName, data, setData, apiEndpoint, children, method }) => {
// 	const { handleOk, handleCancel, setSelectedData } = useModal()
// 	const { handleSubmit, reset } = useFormContext()

// 	const onCancel = () => {
// 		handleCancel()
// 	}

// 	const onSubmit: SubmitHandler<FieldValues> = async (form) => {
// 		const body = buildRequestBody(form)

// 		const request = {
// 			method,
// 			url: apiEndpoint,
// 			data: body,
// 			headers: {
// 				"Content-Type": form.image ? "multipart/form-data" : "application/json",
// 			},
// 		}

// 		try {
// 			const res = await api.request(request)

// 			if (method === "PATCH") {
// 				const updatedEntity = res.data.values.updated
// 				const index = data.findIndex((entity) => entity.id === updatedEntity.id)

// 				if (index !== -1) {
// 					const updatedData = [...data]
// 					updatedData[index] = updatedEntity
// 					setData(updatedData)
// 				}
// 			}

// 			if (method === "POST") {
// 				setData([res.data.values, ...data])
// 			}

// 			message.success(res.data.message)
// 			reset()

// 			handleOk()
// 		} catch (error: any) {
// 			if (error.response) {
// 				message.error(error.response.data.message)
// 				if (error.response.status === 409) {
// 					handleConflicts(entityName, error.response.data.values.conflicts)
// 				}

// 				return
// 			}

// 			console.log(error)

// 			message.error("Error. Intente nuevamente.")
// 		}
// 	}

// 	return (
// 		<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit)}>
// 			{children}
// 			<div className="flex flex-row gap-4 w-full justify-end -mb-6">
// 				<Button type="button" variant="secondary" onClick={onCancel}>
// 					Cancelar
// 				</Button>

// 				<Button type="submit" variant="primary">
// 					Guardar
// 				</Button>
// 			</div>
// 		</form>
// 	)
// }

// export default Form
