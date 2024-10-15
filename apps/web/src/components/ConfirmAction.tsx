import React from "react"

import { Modal } from "./Modal"
import { Button } from "./ui/Button"
import { message } from "antd"
import { useModal } from "../context/ModalContext"
import { useMutation } from "../hooks/useMutation"
import { Dispatch, SetStateAction } from "react"
import { MutateAction, BaseDataType, MutationResponse } from "../lib/types"

interface ConfirmActionProps<T> {
	text: string
	data: T | T[]
	setData: Dispatch<SetStateAction<T | null>> | Dispatch<SetStateAction<T[]>>
	action: MutateAction
}

const ConfirmDelete = <T extends BaseDataType>({ text, data, setData, action }: ConfirmActionProps<T>) => {
	const { handleOk, handleCancel, selectedData } = useModal()

	const mutation = useMutation<MutationResponse<T>>({
		mutateFn: action,
	})

	const handleConfirm = async () => {
		await mutation.mutate({
			params: { id: selectedData?.id || null },
			onSuccess: (res) => {
				const { modified: deleted } = res

				if (!deleted) {
					message.error("Error al guardar. Intente nuevamente o recargue la página.")
					return
				}

				if (Array.isArray(data)) {
					const setter = setData as Dispatch<SetStateAction<T[]>>
					setter(data.filter((element) => element.id !== deleted.id))
				} else {
					const setter = setData as Dispatch<SetStateAction<T | null>>
					setter(null)
				}

				message.success("Hecho")
				handleOk()
			},
			onError: (error) => {
				console.error("Error en el delete:", error)
				message.error("Error al eliminar el registro")
				handleCancel()
			},
		})
	}

	return (
		<Modal title="Confirmar acción" type="Confirm">
			<div className="mt-12 flex flex-col gap-8 justify-center items-center">
				<h2 className="text-lg font-light text-center">{text}</h2>
				<div className="flex flex-row gap-4 w-full justify-center mt-4">
					<Button type="button" variant="secondary" className="w-1/4" onClick={() => handleCancel()}>
						Cancelar
					</Button>

					<Button onClick={() => handleConfirm()} variant="primary" className="w-1/4">
						Confirmar
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default ConfirmDelete
