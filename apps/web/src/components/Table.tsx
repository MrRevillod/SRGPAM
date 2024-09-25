import React from "react"
import { Table, Space } from "antd"
import type { DataType } from "../lib/types"
import { HiPencil } from "react-icons/hi"

interface PersonTableProps {
	data: DataType[]
	columnsConfig: Array<{ title: string; dataIndex: keyof DataType; key: string }>
	onEdit?: (person: DataType) => void
}

const isDateString = (value: any) => {
	return typeof value === "string" && !isNaN(Date.parse(value))
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString()
}

const renderBoolean = (value: boolean) => {
	return value ? "Si" : "No"
}

const PersonTable: React.FC<PersonTableProps> = ({ data, columnsConfig, onEdit }) => {
	const dateKeys = ["birthDate", "updatedAt", "createdAt"]
	return (
		<Table dataSource={data} rowKey={(record) => record.id}>
			{columnsConfig.map((col) => (
				<Table.Column
					key={col.key}
					title={col.title}
					dataIndex={col.dataIndex}
					render={(value: any) => {
						if (dateKeys.includes(col.key) && isDateString(value)) {
							return formatDate(value)
						}
						if (col.key === "validated") {
							return renderBoolean(value)
						}
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
