import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

export type ModalType = "Create" | "Edit" | "Confirm"

type Nullable<T> = T | null

interface ModalContextProps {
	isModalOpen: boolean
	showModal: (type: ModalType, data: any) => void
	handleOk: () => void
	handleCancel: () => void
	modalType: Nullable<ModalType>
	selectedData: any
	setSelectedData: Dispatch<SetStateAction<any>>
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalType, setModalType] = useState<ModalType | null>(null)
	const [selectedData, setSelectedData] = useState<any>(null)

	const showModal = (type: ModalType, data: any) => {
		setModalType(type)
		setSelectedData(data)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setSelectedData(null)
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setSelectedData(null)
		setIsModalOpen(false)
	}

	return (
		<ModalContext.Provider
			value={{ setSelectedData, isModalOpen, showModal, handleOk, handleCancel, modalType, selectedData }}
		>
			{children}
		</ModalContext.Provider>
	)
}

export const useModal = () => {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error("useModal debe ser usado dentro de un ModalProvider")
	}
	return context
}
