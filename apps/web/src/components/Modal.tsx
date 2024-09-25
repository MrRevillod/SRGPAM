import React, { useState } from "react"
import { Button, Modal } from "antd"

interface ModalsProps {
	title: string
	isVisible: boolean
	onOk: () => void
	onCancel: () => void
	footer?: React.ReactNode[]
	children: React.ReactNode
}

const Modals: React.FC<ModalsProps> = ({ title, isVisible, onOk, onCancel, footer, children }) => {
	return (
		<Modal title={title} open={isVisible} onOk={onOk} onCancel={onCancel} footer={footer}>
			{children}
		</Modal>
	)
}

export default Modals
