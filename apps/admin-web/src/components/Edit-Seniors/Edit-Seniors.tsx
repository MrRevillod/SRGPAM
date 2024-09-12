import React from "react"
import { Modal, Form, Input, message, Button } from "antd"
import axios from "axios"
import type { DataType, FieldType } from "../../types"

interface EditPersonModalProps {
	visible: boolean
	person: DataType | null
	modalType: string
	onCancel: () => void
	onOk: () => void
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({ visible, person, modalType, onCancel, onOk }) => {
	const [form] = Form.useForm()

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()

			if (modalType === "Edit" && person?.id) {
				await axios.patch(`http://localhost:5000/api/dashboard/seniors/${person.id}`, {
					name: values.name,
					email: values.email,
					password: values.password,
					address: values.address,
					birthDate: values.birthDate,
				})
				message.success("Persona actualizada correctamente")
			} else {
				message.error("No se pudo encontrar el ID de la persona")
			}

			form.resetFields()
			onOk()
		} catch (error) {
			message.error("Error al enviar el formulario")
			console.error("Error en el submit:", error)
		}
	}

	const handleDelete = async () => {
		try {
			if (person?.id) {
				await axios.delete(`http://localhost:5000/api/dashboard/seniors/${person.id}`)
				message.success("Persona eliminada correctamente")
				form.resetFields()
				onOk()
			} else {
				message.error("No se pudo encontrar el ID de la persona")
			}
		} catch (error) {
			message.error("Error al eliminar la persona")
			console.error("Error en el delete:", error)
		}
	}

	return (
		<Modal
			title={`${modalType} ${person?.name || "New Person"}`}
			open={visible}
			onOk={handleSubmit}
			onCancel={() => {
				form.resetFields()
				onCancel()
			}}
			footer={[
				<Button key="back" onClick={onCancel}>
					Cancelar
				</Button>,
				modalType === "Edit" && (
					<Button key="delete" danger onClick={handleDelete}>
						Eliminar
					</Button>
				),
				<Button key="submit" type="primary" onClick={handleSubmit}>
					Guardar
				</Button>,
			]}
		>
			{person && (
				<Form
					form={form}
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					initialValues={{
						name: person.name,
						email: person.email,
						address: person.address,
						birthDate: person.birthDate,
						password: "",
					}}
					autoComplete="off"
				>
					<Form.Item<FieldType> label="Name" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="Email" name="email" rules={[{ type: "email", message: "Please input a valid email!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="Address" name="address" rules={[{ required: true, message: "Please input your address!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="BirthDate" name="birthDate" rules={[{ required: true, message: "Please input your birth date!" }]}>
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: "Please input a password!" }]}>
						<Input.Password />
					</Form.Item>
				</Form>
			)}
		</Modal>
	)
}

export default EditPersonModal
