import { useState } from "react"

export const useModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalType, setModalType] = useState<"Create" | "Edit" | "Delete" | null>(null)
	const [selectedData, setSelectedData] = useState<any>(null)

	const showModal = (type: "Create" | "Edit" | "Delete", data: any) => {
		setModalType(type)
		setSelectedData(data)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
		setSelectedData(null)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setSelectedData(null)
	}

	return {
		isModalOpen,
		showModal,
		handleOk,
		handleCancel,
		modalType,
		selectedData,
	}
}
