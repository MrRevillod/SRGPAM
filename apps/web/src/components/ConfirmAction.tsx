import React, { Dispatch, SetStateAction } from "react"
import { message } from "antd"
import { Modal } from "./Modal"
import { useModal } from "../context/ModalContext"
import { Button } from "./ui/Button"

interface ConfirmActionProps {
	text: string
	executeAction: (element: any) => any | Promise<any>
	data?: any[]
	setData?: Dispatch<SetStateAction<any[]>>
}

const ConfirmDelete: React.FC<ConfirmActionProps> = ({ text, executeAction, setData, data }) => {
	const { handleOk, handleCancel, selectedData } = useModal()

	const handleConfirm = async () => {
		try {
			const response = await executeAction(selectedData)

			if (!response || response?.data.type === "error") {
				throw new Error("Error al eliminar el registro")
			}

			const deletedId = response?.data.values.deletedId

			if (data && setData) {
				setData(data.filter((element: any) => element.id !== deletedId))
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
