import React from "react"
import { Table, Space } from "antd"
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai"
import { BaseDataType, TableColumnType } from "../lib/types"
import { tableColumnsFormatters } from "../lib/formatters"

interface TableProps<T> {
	data: T[]
	columnsConfig: TableColumnType<T>
	onView?: (person: T) => void
	onEdit?: (person: T) => void
	onDelete?: (person: T) => void
}

const DataTable = <T extends BaseDataType>({ data, columnsConfig, onView, onEdit, onDelete }: TableProps<T>) => {
	return (
		<Table dataSource={data} rowKey={(record) => record.id} size="middle" pagination={{ size: "default" }}>
			{columnsConfig.map((col) => (
				<Table.Column
					key={col.key}
					title={col.title}
					dataIndex={col.dataIndex as string}
					render={(value: any) => {
						if (tableColumnsFormatters[col.key as keyof typeof tableColumnsFormatters]) {
							const colKey = col.key as keyof typeof tableColumnsFormatters
							return tableColumnsFormatters[colKey](value as never)
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
							<a title="Editar" onClick={() => onEdit && onEdit(record)}>
								<AiFillEdit className="text-green-600 text-md font-light h-6 w-6" />
							</a>
						)}
						{onDelete && (
							<a title="Eliminar" onClick={() => onDelete && onDelete(record)}>
								<AiFillDelete className="text-red-700 text-md font-light h-6 w-6" />
							</a>
						)}
						{onView && (
							<a title="Ver" onClick={() => onView(record)}>
								<AiFillEye className="text-blue-500 text-md font-light h-6 w-6" />
							</a>
						)}
					</Space>
				)}
			/>
		</Table>
	)
}

export default DataTable
