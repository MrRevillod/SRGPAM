import React, { useState, useEffect, Fragment } from "react"
import { api } from "../../lib/axios"
import { Administrator } from "../../lib/types"
import { AdministratorColumns } from "../../lib/columns"

import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import ConfirmDelete from "../../components/ConfirmDelete"
import UpdateAdministrator from "../../components/forms/update/Administrator"
import CreateAdministrator from "../../components/forms/create/Administrator"

const AdministratorsPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedPerson, setSelectedPerson] = useState<Administrator | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<Administrator[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchAdministrators = async () => {
		try {
			const response = await api.get("/dashboard/administrators")
			setData(response.data.values.administrators)
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

	const showModal = (type: string, element: Administrator | null) => {
		setModalType(type)
		setSelectedPerson(element)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
		setSelectedPerson(null)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setSelectedPerson(null)
	}

	return (
		<PageLayout pageTitle="Administradores" addFunction={() => showModal("Create", null)} setData={() => {}}>
			<Fragment>
				<DataTable<Administrator>
					data={data}
					columnsConfig={AdministratorColumns}
					onEdit={(person) => showModal("Edit", person)}
					onDelete={(person) => showModal("Delete", person)}
				/>
				<UpdateAdministrator
					visible={isModalOpen && modalType === "Edit"}
					entity={selectedPerson}
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
					modalType={modalType}
					text="Administrador"
					visible={isModalOpen && modalType === "Delete"}
					onCancel={handleCancel}
					onOk={handleOk}
					data={data}
					setData={setData}
					selectedElement={selectedPerson}
				/>
			</Fragment>
		</PageLayout>
	)
}

export default AdministratorsPage
