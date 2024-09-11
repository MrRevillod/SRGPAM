import React from "react"
import { Table, Space } from "antd"
import type { TableProps } from "antd"
import type { DataType } from "../../types"

interface PersonTableProps {
	data: DataType[]
	onEdit: (person: DataType) => void
	onDelete: (person: DataType) => void
}

const PersonTable: React.FC<PersonTableProps> = ({ data, onEdit, onDelete }) => {
	const columns: TableProps<DataType>["columns"] = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<Space size="middle">
					<a onClick={() => onEdit(record)}>Edit</a>
					<a onClick={() => onDelete(record)}>Delete</a>
				</Space>
			),
		},
	]

	return <Table columns={columns} dataSource={data} />
}

export default PersonTable
