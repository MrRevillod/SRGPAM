import React from "react"
import { api } from "../../lib/axios"
import { Modal, message } from "antd"
import { FieldValues, SubmitHandler } from "react-hook-form"

interface FormProps {
	modalTitle: string
	entityName: string
	visible: boolean
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: (data: any[]) => void
	apiEndpoint: string
	children: React.ReactNode
	formContext: any
	method: "POST" | "PATCH"
}

const Form: React.FC<FormProps> = ({
	modalTitle,
	entityName,
	visible,
	onCancel,
	onOk,
	data,
	setData,
	apiEndpoint,
	formContext,
	children,
	method,
}) => {
	const { handleSubmit, setError, reset, getValues } = formContext

	const handleCancel = () => {
		reset()
		onCancel()
	}

    const onSubmit: SubmitHandler<FieldValues> = async (form) => {
        console.log(getValues())
		let formData = new FormData()

		if (form.birthDate) {
			form.birthDate = new Date(form.birthDate).toISOString()
		}

		if (form.image) {
			Object.keys(form).forEach((key) => {
				if (key === "image") {
					formData.append("image", form.image[0])
				} else {
					formData.append(key, form[key])
				}
			})
		}

		const request = {
			method,
			url: apiEndpoint,
			data: form.image ? formData : form,
			headers: {
				"Content-Type": form.image ? "multipart/form-data" : "application/json",
			},
		}

		try {
			const res = await api.request(request)

			if (method === "PATCH") {
				const updatedEntity = res.data.values
				const updatedData = data.map((entity) => {
					if (entity.id === updatedEntity.id) {
						return updatedEntity
					}
					return entity
				})
				setData(updatedData)
			}

			if (method === "POST") {
				setData([res.data.values, ...data])
			}

			message.success(res.data.message)
			reset()
			onOk()
        } catch (error: any) {
            
			if (error.response) {
				message.error(error.response.data.message)

				if (error.response.status === 409) {
					console.log(error.response.data.values.conflicts)

					error.response.data.values.conflicts.forEach((element: string) => {
						setError(element, {
							type: "manual",
							message: `Ya existe un ${entityName} con este valor`,
						})
					})
				}

				return
			}

			message.error("Error. Intente nuevamente.")
		}
	}

	return (
		<Modal title={modalTitle} open={visible}  onClose={handleCancel} onCancel={handleCancel} footer={[]}>
			<form className="flex flex-col gap-4 py-6" onSubmit={handleSubmit(onSubmit)}>
				{children}
				<div className="flex flex-row gap-4 w-full justify-end -mb-6">
					<button
						onClick={handleCancel}
						className="border-1 border-red-700 text-red-700 font-semibold px-6 py-2 rounded-lg"
                        type={"reset"}
					>
						Cancelar
					</button>
					<button type="submit" className="bg-green-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg">
						Confirmar
					</button>
				</div>
			</form>
		</Modal>
	)
}

export default Form
