import React from "react"
import { Table, Space } from "antd"
import type { BaseDataType, TableColumnType } from "../lib/types"
import { FiEdit, FiDelete, FiEye } from "react-icons/fi"

interface TableProps<T> {
	data: T[]
	columnsConfig: TableColumnType<T>
	onView?: (person: T) => void
	onEdit?: (person: T) => void
	onDelete?: (person: T) => void
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

const DataTable = <T extends BaseDataType>({ data, columnsConfig, onView, onEdit, onDelete }: TableProps<T>) => {
	const dateKeys = ["birthDate", "updatedAt", "createdAt"]

	return (
		<Table dataSource={data} rowKey={(record) => record.id} size="middle">
			{columnsConfig.map((col) => (
				<Table.Column
					key={col.key}
					title={col.title}
					dataIndex={col.dataIndex as string}
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

			<Table.Column
				title="Administrar"
				key="action"
				render={(_, record: T) => (
					<Space size="large">
						{onEdit && (
							<a onClick={() => onEdit && onEdit(record)}>
								<FiEdit className="text-green-700 text-md font-light h-6 w-6" />
							</a>
						)}
						{onDelete && (
							<a onClick={() => onDelete && onDelete(record)}>
								<FiDelete className="text-red-700 text-md font-light h-6 w-6" />
							</a>
						)}
						{onView && (
							<a onClick={() => onView(record)}>
								<FiEye className="text-blue-500 text-md font-light h-6 w-6" />
							</a>
						)}
					</Space>
				)}
			/>
		</Table>
	)
}

export default DataTable
