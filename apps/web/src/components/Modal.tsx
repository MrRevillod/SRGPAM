import React from "react"

import { Modal as AntDModal } from "antd"
import { ModalType, useModal } from "../context/ModalContext"

interface ModalsProps {
	title: string
	type: ModalType
	children: React.ReactNode
}

export const Modal: React.FC<ModalsProps> = ({ title, type, children }) => {
	const { isModalOpen, handleOk, handleCancel, modalType } = useModal()

	return (
		<AntDModal
			title={title}
			open={isModalOpen && modalType === type}
			onOk={handleOk}
			onCancel={handleCancel}
			closable={true}
			footer={[]}
		>
			{children}
		</AntDModal>
	)
}
