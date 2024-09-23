// Create-Seniors.tsx
import React from "react"
import { Modal, Form, Input, message, Button } from "antd"
import axios from "axios"
import type { DataType } from "../../lib/types"

interface CreateSeniorsProps {
	visible: boolean
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: (data: any[]) => void
}

const CreateSeniors: React.FC<CreateSeniorsProps> = ({ visible, onCancel, onOk, data, setData }) => {
	const [form] = Form.useForm()

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()

			// Enviar el POST a la API
			await axios.post("http://localhost/api/dashboard/seniors/pre-checked/", {
				id: values.id,
				email: values.email,
				name: values.name,
				address: values.address,
				birthDate: values.birthDate,
			})

			message.success("Usuario creado correctamente")
			const user = {
				id: values.id,
				email: values.email,
				name: values.name,
				address: values.address,
				birthDate: values.birthDate,
				createdAt: new Date().toUTCString(),
				updatedAt: new Date().toUTCString(),
			}
			setData([...data, user])
			form.resetFields()
			onOk()
		} catch (error) {
			message.error("Error al crear el usuario")
			console.error("Error en el submit:", error)
		}
	}

	return (
		<Modal
			title="Crear Nuevo Usuario"
			open={visible}
			onOk={handleSubmit}
			onCancel={onCancel}
			footer={[
				<Button key="back" onClick={onCancel}>
					Cancelar
				</Button>,
				<Button
					style={{ backgroundColor: "#16a34a", borderColor: "#16a34a" }}
					key="submit"
					type="primary"
					onClick={handleSubmit}
				>
					Crear
				</Button>,
			]}
		>
			<Form
				form={form}
				name="create"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={{
					id: "210279067",
					email: "kristobalsandoval@gmail.com",
					name: "Cristobal Sandoval",
					address: "Agua Marina 661",
					birthDate: "2024-09-22T19:42:46.791Z",
				}}
				autoComplete="off"
			>
				<Form.Item label="RUT" name="id" rules={[{ required: true, message: "Por favor, introduce el ID" }]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Nombre"
					name="name"
					rules={[{ required: true, message: "Por favor, introduce tu nombre" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Correo Electrónico"
					name="email"
					rules={[{ type: "email", message: "Por favor, introduce un correo electrónico válido" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Dirección"
					name="address"
					rules={[{ required: true, message: "Por favor, introduce tu dirección" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Fecha de Nacimiento"
					name="birthDate"
					rules={[{ required: true, message: "Por favor, introduce tu fecha de nacimiento" }]}
				>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default CreateSeniors
