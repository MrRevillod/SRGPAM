import React from "react"

import { Modal as AntDModal } from "antd"
import { ModalType, useModal } from "../context/ModalContext"

interface ModalProps {
	title: string
	type: ModalType
	loading?: boolean
	children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ title, type, loading, children }) => {
	const { isModalOpen, handleOk, handleCancel, modalType, handleClose } = useModal()

	return (
		<AntDModal
			title={title}
			open={isModalOpen && modalType === type}
			onOk={handleOk}
			onCancel={handleCancel}
			closable={true}
			footer={[]}
			onClose={handleClose}
			loading={loading}
		>
			{children}
		</AntDModal>
	)
}
