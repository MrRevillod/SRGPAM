import React, { useState } from "react"

import { Button } from "../ui/Button"
import { useModal } from "../../context/ModalContext"
import { useMutation } from "../../hooks/useMutation"
import { ImageSelector } from "../ImageSelector"
import { message, UploadFile } from "antd"
import { buildRequestBody, handleFormError } from "../../lib/form"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"
import { BaseDataType, MutateAction, MutationResponse, Nullable } from "../../lib/types"

interface FormProps<T> {
	data: T[]
	setData: Dispatch<SetStateAction<T[]>>
	action: MutateAction
	children: ReactNode
	actionType: "update" | "create"
}

export const Form = <T extends BaseDataType>({ data, setData, action, actionType, children }: FormProps<T>) => {
	const { handleSubmit, reset, setError } = useFormContext()
	const { handleOk, handleCancel, selectedData } = useModal()

	const [imageFile, setImageFile] = useState<UploadFile[]>([])

	const onCancel = () => {
		handleCancel()
		setImageFile([])
	}

	const mutation = useMutation<MutationResponse<T>>({
		mutateFn: action,
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		const body = buildRequestBody(formData)

		await mutation.mutate({
			params: { id: selectedData?.id || null, body },
			onSuccess: (res) => {
				if (!res.modified) {
					return message.error("Error al guardar. Intente nuevamente o recargue la página.")
				}

				if (actionType === "update") {
					const { modified: updated, image } = res

					const index = data.findIndex((entity) => entity.id === updated?.id)

					if (index !== -1) {
						const updatedData = [...data]
						updatedData[index] = { ...updated, image }
						setData(updatedData)
					}
				} else if (actionType === "create") {
					setData([res.modified, ...data])
				}

				message.success("Hecho")
				reset()
				setImageFile([])
				handleOk()
			},
			onError: (error) => {
				handleFormError(error, setError)
			},
		})
	}

	return (
		<form
			className="flex flex-col gap-4 py-6 bg-light dark:bg-primary-dark rounded-lg"
			onSubmit={handleSubmit(onSubmit)}
		>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child) && child.type === ImageSelector) {
					return React.cloneElement(child, { imageFile, setImageFile } as any)
				}
				return child
			})}
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

// import React, { useState } from "react"

// import { Button } from "../ui/Button"
// import { message, UploadFile } from "antd"
// import { useModal } from "../../context/ModalContext"
// import { useMutation } from "../../hooks/useMutation"
// import { buildRequestBody, handleFormError } from "../../lib/form"
// import { Dispatch, ReactNode, SetStateAction } from "react"
// import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"
// import { BaseDataType, MutateAction, MutationResponse } from "../../lib/types"

// interface FormProps<T> {
// 	data: T[]
// 	setData: Dispatch<SetStateAction<T[]>>
// 	action: MutateAction
// 	children: ReactNode
// 	actionType: "update" | "create"
// }

// export const Form = <T extends BaseDataType>({ data, setData, action, actionType, children }: FormProps<T>) => {
// 	const { handleSubmit, reset, setError } = useFormContext()
// 	const { handleOk, handleCancel, selectedData } = useModal()

// 	const [imageFile, setImageFile] = useState<UploadFile | null>(null)

// 	const onCancel = () => {
// 		handleCancel()
// 	}

// 	const mutation = useMutation<MutationResponse<T>>({
// 		mutateFn: action,
// 	})

// 	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
// 		const body = buildRequestBody({ ...formData, image: imageFile })

// 		console.log(body)

// 		await mutation.mutate({
// 			params: { id: selectedData?.id || null, body },
// 			onSuccess: (res) => {
// 				if (!res.modified) {
// 					message.error("Error al guardar. Intente nuevamente o recargue la página.")
// 					return
// 				}

// 				if (actionType === "update") {
// 					const { modified: updated, image } = res

// 					const index = data.findIndex((entity) => entity.id === updated?.id)

// 					if (index !== -1) {
// 						const updatedData = [...data]
// 						updatedData[index] = { ...updated, image }
// 						setData(updatedData)
// 					}
// 				} else if (actionType === "create") {
// 					setData([res.modified, ...data])
// 				}

// 				console.log("Hecho")

// 				message.success("Hecho")
// 				reset()
// 				handleOk()
// 			},
// 			onError: (error) => {
// 				handleFormError(error, setError)
// 				handleCancel()
// 			},
// 		})
// 	}

// 	return (
// 		<form
// 			className="flex flex-col gap-4 py-6 bg-light dark:bg-primary-dark rounded-lg"
// 			onSubmit={handleSubmit(onSubmit)}
// 		>
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
