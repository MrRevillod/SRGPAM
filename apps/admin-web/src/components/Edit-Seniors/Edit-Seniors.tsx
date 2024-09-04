// components/EditPersonModal.tsx
import React from "react"
import { Modal, Form, Input } from "antd"
import type { FormProps } from "antd"
import type { DataType, FieldType } from "../../types"

interface EditPersonModalProps {
	visible: boolean
	person: DataType | null
	modalType: string
	onCancel: () => void
	onOk: () => void
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({ visible, person, modalType, onCancel, onOk }) => {
	return (
		<Modal title={`${modalType} ${person?.name}`} open={visible} onOk={onOk} onCancel={onCancel}>
			{person && (
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					initialValues={{
						username: person.name,
						email: person.email,
						age: person.age,
						password: person.password,
					}}
					autoComplete="off"
				>
					<Form.Item<FieldType> label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="Email" name="email" rules={[{ type: "email", message: "Please input a valid email!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="Age" name="age" rules={[{ type: "number", message: "Please input your age!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
						<Input />
					</Form.Item>
				</Form>
			)}
		</Modal>
	)
}

export default EditPersonModal
