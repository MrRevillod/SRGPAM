import React, { useEffect } from "react"
import { Modal, Form, Input, message, Button } from "antd"
import axios from "axios"
import type { DataType, FieldType } from "../../lib/types"
import { SetStateAction, Dispatch } from "react"

interface EditPersonModalProps {
	visible: boolean
	person: DataType | null
	modalType: string
	onCancel: () => void
	onOk: () => void
	data: any[]
	setData: Dispatch<SetStateAction<DataType[]>>
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({
	visible,
	person,
	modalType,
	onCancel,
	onOk,
	data,
	setData,
}) => {
	const [form] = Form.useForm()

	// Este useEffect se ejecutará cuando `person` cambie
	useEffect(() => {
		if (person) {
			// Si hay una persona seleccionada, establece los valores del formulario
			form.setFieldsValue({
				name: person.name,
				email: person.email,
				address: person.address,
				birthDate: person.birthDate,
				password: "", // Si prefieres no mostrar la contraseña anterior
			})
		} else {
			// Si no hay persona seleccionada, resetea el formulario
			form.resetFields()
		}
	}, [person, form])

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()

			if (modalType === "Edit" && person?.id) {
				await axios.patch(`http://localhost/api/dashboard/seniors/${person.id}`, {
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

			const userUpdate = {
				id: person?.id,
				name: values.name,
				email: values.email,
				password: values.password,
				address: values.address,
				birthDate: values.birthDate,
				createdAt: new Date().toUTCString(),
				updatedAt: new Date().toUTCString(),
			}

			// Actualiza la lista de usuarios
			const updatedData = data.map((item) => (item.id === person?.id ? { ...item, ...userUpdate } : item))
			setData(updatedData)

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
				await axios.delete(`http://localhost/api/dashboard/seniors/${person.id}`)

				message.success("Persona eliminada correctamente")

				// Elimina el usuario de la lista
				const updatedData = data.filter((item) => item.id !== person.id)
				setData(updatedData)

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
			title={`Administrar`}
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
				<Button
					style={{ backgroundColor: "#16a34a", borderColor: "#16a34a" }}
					key="submit"
					type="primary"
					onClick={handleSubmit}
				>
					Guardar
				</Button>,
			]}
		>
			{person && (
				<Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off">
					<Form.Item<FieldType>
						label="Nombre"
						name="name"
						rules={[{ required: true, message: "Please input your name!" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="Correo Electrónico"
						name="email"
						rules={[{ type: "email", message: "Please input a valid email!" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="Dirección"
						name="address"
						rules={[{ required: true, message: "Please input your address!" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="Fecha de nacimiento"
						name="birthDate"
						rules={[{ required: true, message: "Please input your birth date!" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="Contraseña"
						name="password"
						rules={[{ message: "Please input a password!" }]}
					>
						<Input.Password />
					</Form.Item>
				</Form>
			)}
		</Modal>
	)
}

export default EditPersonModal
