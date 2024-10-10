import React from "react"
import { Table, Space } from "antd"
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai"
import { BaseDataType, TableColumnType } from "../lib/types"
import { tableColumnsFormatters } from "../lib/formatters"
import { useModal } from "../context/ModalContext"

interface TableProps<T> {
	data: T[]
	columnsConfig: TableColumnType<T>
	loading?: boolean
	onView?: (person: T) => void
	editable?: boolean
	deletable?: boolean
}

const DataTable = <T extends BaseDataType>({
	data,
	columnsConfig,
	loading,
	onView,
	editable,
	deletable,
}: TableProps<T>) => {
	const { showModal } = useModal()

	return (
		<Table
			loading={loading}
			dataSource={data}
			rowKey={(record) => record.id}
			size="middle"
			pagination={{ size: "default" }}
		>
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
						{editable && (
							<a title="Editar" onClick={() => showModal("Edit", record)}>
								<AiFillEdit className="text-green-600 text-md font-light h-6 w-6" />
							</a>
						)}
						{deletable && (
							<a title="Eliminar" onClick={() => showModal("Confirm", record)}>
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
