import React, { Dispatch, SetStateAction } from "react"
import { Modal, message } from "antd"

interface ConfirmActionProps {
	text: string
	visible: boolean
	onCancel: () => void
	onOk: () => void
	executeAction: (element: any) => any | Promise<any>
	data?: any[]
	setData?: Dispatch<SetStateAction<any[]>>
	selectedElement?: any | null
}

const ConfirmDelete: React.FC<ConfirmActionProps> = ({
	text,
	visible,
	onCancel,
	onOk,
	executeAction,
	setData,
	data,
	selectedElement,
}) => {
	const handleConfirm = async () => {
		try {
			const response = await executeAction(selectedElement)

			if (!response || response?.data.type === "error") {
				throw new Error("Error al eliminar el registro")
			}

			const deletedId = response?.data.values.deletedId

			if (data && setData) {
				setData(data.filter((element: any) => element.id !== deletedId))
			}

			message.success("Hecho")
			onOk()
		} catch (error) {
			console.error("Error en el delete:", error)
			message.error("Error al eliminar el registro")
			onCancel()
		}
	}

	return (
		<Modal open={visible} onCancel={onCancel} footer={[]}>
			<div className="mt-12 flex flex-col gap-8 justify-center items-center">
				<h2 className="text-lg font-light text-center">
					{`¿Estás seguro de eliminar la información de este/esta ${text}? Esta acción no se puede deshacer.`}
				</h2>
				<div className="flex flex-row gap-4 w-full justify-center">
					<button
						onClick={onCancel}
						className="bg-red-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg"
					>
						Cancelar
					</button>
					<button
						onClick={handleConfirm}
						className="bg-green-700 text-neutral-100 font-semibold px-6 py-2 rounded-lg"
					>
						Confirmar
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default ConfirmDelete
