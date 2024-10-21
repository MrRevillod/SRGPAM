import React, { useState } from "react"

import { Button } from "../ui/Button"
import { useModal } from "../../context/ModalContext"
import { useMutation } from "../../hooks/useMutation"
import { ImageSelector } from "../ImageSelector"
import { message, UploadFile } from "antd"
import { buildRequestBody, handleFormError } from "../../lib/form"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"
import { BaseDataType, MutateAction, MutationResponse } from "../../lib/types"

interface FormProps<T> {
	data: T[]
	setData: Dispatch<SetStateAction<T[]>>
	action: MutateAction
	children: ReactNode
	actionType: "update" | "create"
	deletable?: boolean
}

export const Form = <T extends BaseDataType>({
	data,
	setData,
	action,
	actionType,
	deletable,
	children,
}: FormProps<T>) => {
	const { handleSubmit, reset, setError } = useFormContext()
	const { handleOk, handleCancel, selectedData, handleDelete } = useModal()

	const [imageFile, setImageFile] = useState<UploadFile[]>([])

	const onCancel = () => {
		handleCancel()
		setImageFile([])
	}

	const onDelete = () => {
		handleDelete()
	}

	const mutation = useMutation<MutationResponse<T>>({
		mutateFn: action,
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		const body = buildRequestBody(formData)

		if (JSON.stringify(formData) === JSON.stringify(body)) {
			console.log(message.error)
			message.error("No se han realizado cambios")
			return
		}

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
				{deletable && (
					<Button type="button" className="justify" variant="delete" onClick={onDelete}>
						Eliminar
					</Button>
				)}
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
