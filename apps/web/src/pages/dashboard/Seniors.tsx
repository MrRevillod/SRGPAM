import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import CreateSenior from "../../components/forms/create/Senior"
import UpdateSenior from "../../components/forms/update/Senior"
import ConfirmDelete from "../../components/ConfirmDelete"

import { api } from "../../lib/axios"
import { Senior } from "../../lib/types"
import { useModal } from "../../hooks/modal"
import { SeniorsColumns } from "../../lib/columns"
import { useState, useEffect, Fragment } from "react"

const SeniorsPage: React.FC = () => {
	const [data, setData] = useState<Senior[]>([])
	const [originalData, setOriginalData] = useState<Senior[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchSeniors = async () => {
		try {
			const response = await api.get("/dashboard/seniors")
			setData(response.data.values.seniors)
			setOriginalData(response.data.values.seniors)
		} catch (err) {
			setError("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSeniors()
	}, [])

	const handleDelete = async (element: any) => {
		try {
			const response = await api.delete(`/dashboard/seniors/${element.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	const { isModalOpen, showModal, handleOk, handleCancel, modalType, selectedData } = useModal()

	return (
		<PageLayout
			pageTitle="Personas mayores"
			addFunction={() => showModal("Create", null)}
			setData={setData}
			data={originalData}
			searchKeys={["id", "name", "email"]}
		>
			<Fragment>
				<DataTable<Senior>
					data={data}
					columnsConfig={SeniorsColumns}
					onEdit={(person) => showModal("Edit", person)}
					onDelete={(person) => showModal("Delete", person)}
				/>
				<UpdateSenior
					visible={isModalOpen && modalType === "Edit"}
					entity={selectedData}
					onCancel={handleCancel}
					onOk={handleOk}
					data={data}
					setData={setData}
				/>
				<CreateSenior
					visible={isModalOpen && modalType === "Create"}
					onCancel={handleCancel}
					onOk={handleOk}
					setData={setData}
					data={data}
				/>
				<ConfirmDelete
					executeAction={(element) => handleDelete(element)}
					text="Persona mayor"
					visible={isModalOpen && modalType === "Delete"}
					onCancel={handleCancel}
					onOk={handleOk}
					data={data}
					setData={setData}
					selectedElement={selectedData}
				/>
			</Fragment>
		</PageLayout>
	)
}

export default SeniorsPage
