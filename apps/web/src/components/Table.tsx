import React from "react"
import { Table, Space } from "antd"
import type { DataType } from "../lib/types"
import { HiPencil } from "react-icons/hi"

interface PersonTableProps {
	data: DataType[]
	columnsConfig: Array<{ title: string; dataIndex: keyof DataType; key: string }>
	onEdit?: (person: DataType) => void // Ahora es opcional
}

const isDateString = (value: any) => {
	return typeof value === "string" && !isNaN(Date.parse(value))
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString() // Puedes personalizar el formato aquí
}

const renderBoolean = (value: boolean) => {
	return value ? "Si" : "No" // Puedes cambiar este texto o usar íconos
}

const PersonTable: React.FC<PersonTableProps> = ({ data, columnsConfig, onEdit }) => {
	const dateKeys = ["birthDate", "updatedAt", "createdAt"]
	return (
		<Table dataSource={data}>
			{columnsConfig.map((col) => (
				<Table.Column
					key={col.key}
					title={col.title}
					dataIndex={col.dataIndex}
					render={(value: any) => {
						// Si la columna es updatedAt o createdAt, aplica formato de fecha
						if (dateKeys.includes(col.key) && isDateString(value)) {
							return formatDate(value)
						}
						// Si la columna es validate, renderiza el booleano como texto
						if (col.key === "validated") {
							return renderBoolean(value)
						}
						// Para el resto de los casos, renderiza el valor tal cual
						return value
					}}
				/>
			))}
			{onEdit && (
				<Table.Column
					title="Administrar"
					key="action"
					render={(_, record: DataType) => (
						<Space size="middle">
							<a onClick={() => onEdit(record)}>
								<HiPencil />
							</a>
						</Space>
					)}
				/>
			)}
		</Table>
	)
}

export default PersonTable
