import React, { useState, useEffect, Fragment } from "react"
import { api } from "../../lib/axios"
import { Administrator } from "../../lib/types"
import { AdministratorColumns } from "../../lib/columns"

import { useModal } from "../../hooks/modal"

import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import ConfirmDelete from "../../components/ConfirmDelete"
import UpdateAdministrator from "../../components/forms/update/Administrator"
import CreateAdministrator from "../../components/forms/create/Administrator"

const AdministratorsPage: React.FC = () => {
	const [data, setData] = useState<Administrator[]>([])
	const [originalData, setOriginalData] = useState<Administrator[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchAdministrators = async () => {
		try {
			const { data } = await api.get("/dashboard/administrators")
			setData(data.values.administrators)
			setOriginalData(data.values.administrators)
		} catch (err) {
			setError("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAdministrators()
	}, [])

	const handleDelete = async (element: any) => {
		try {
			const response = await api.delete(`/dashboard/administrators/${element.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	const { isModalOpen, showModal, handleOk, handleCancel, modalType, selectedData } = useModal()

	return (
		<PageLayout
			pageTitle="Administradores"
			addFunction={() => showModal("Create", null)}
			data={originalData}
			setData={setData}
			searchKeys={["id", "name", "email"]}
		>
			<Fragment>
				<DataTable<Administrator>
					data={data}
					columnsConfig={AdministratorColumns}
					onEdit={(person) => showModal("Edit", person)}
					onDelete={(person) => showModal("Delete", person)}
				/>
				<UpdateAdministrator
					visible={isModalOpen && modalType === "Edit"}
					entity={selectedData}
					onCancel={handleCancel}
					onOk={handleOk}
					data={data}
					setData={setData}
				/>
				<CreateAdministrator
					visible={isModalOpen && modalType === "Create"}
					onCancel={handleCancel}
					onOk={handleOk}
					setData={setData}
					data={data}
				/>
				<ConfirmDelete
					executeAction={(element) => handleDelete(element)}
					text="Administrador"
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

export default AdministratorsPage
