import React from "react"

import { Modal } from "./Modal"
import { Button } from "./ui/Button"
import { message } from "antd"
import { useModal } from "../context/ModalContext"
import { useState } from "react"
import { ApiAction, BaseDataType } from "../lib/types"
import { Dispatch, SetStateAction } from "react"

interface ConfirmActionProps<T> {
	text: string
	data?: T | T[]
	setData?: Dispatch<SetStateAction<T | null>> | Dispatch<SetStateAction<T[]>>
	executeAction: ApiAction
}

const ConfirmDelete = <T extends BaseDataType>({ text, data, setData, executeAction }: ConfirmActionProps<T>) => {
	const [loading, setLoading] = useState<boolean>(false)

	const { handleOk, handleCancel, selectedData } = useModal()

	const handleConfirm = async () => {
		setLoading(true)

		try {
			const { data: response } = await executeAction(selectedData)

			setLoading(false)

			if (loading) message.loading("Cargando...")

			const deleted = response.values

			if (data && setData) {
				if (Array.isArray(data)) {
					;(setData as Dispatch<SetStateAction<T[]>>)(data.filter((element) => element.id !== deleted.id))
				} else {
					;(setData as Dispatch<SetStateAction<T | null>>)(null)
				}
			}

			message.success("Hecho")
			handleOk()
		} catch (error) {
			console.error("Error en el delete:", error)
			message.error("Error al eliminar el registro")
			handleCancel()
		}
	}

	return (
		<Modal title="Confirmar acción" type="Confirm">
			<div className="mt-12 flex flex-col gap-8 justify-center items-center">
				<h2 className="text-lg font-light text-center">{text}</h2>
				<div className="flex flex-row gap-4 w-full justify-center mt-4">
					<Button type="button" variant="secondary" className="w-1/4" onClick={() => handleCancel()}>
						Volver
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
