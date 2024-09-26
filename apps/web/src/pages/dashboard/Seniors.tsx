import React, { useState, useEffect, Fragment } from "react"
import { api } from "../../lib/axios"
import { Senior } from "../../lib/types"
import { SeniorsColumns } from "../../lib/columns"

import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import CreateSeniors from "../../components/forms/Create-Seniors"
import ConfirmDelete from "../../components/ConfirmDelete"
import EditPersonModal from "../../components/forms/Edit-Seniors"

const SeniorsPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedPerson, setSelectedPerson] = useState<Senior | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<Senior[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchSeniors = async () => {
		try {
			const response = await api.get("/dashboard/seniors")
			setData(response.data.values.seniors)
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

	const showModal = (type: string, element: Senior | null) => {
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
		<PageLayout pageTitle="Adultos mayores" addFunction={() => showModal("Create", null)} setData={() => {}}>
			<Fragment>
				<DataTable<Senior>
					data={data}
					columnsConfig={SeniorsColumns}
					onEdit={(person) => showModal("Edit", person)}
					onDelete={(person) => showModal("Delete", person)}
				/>
				<EditPersonModal
					visible={isModalOpen && modalType === "Edit"}
					person={selectedPerson}
					modalType={modalType}
					onCancel={handleCancel}
					onOk={handleOk}
					data={data}
					setData={setData}
				/>
				<CreateSeniors
					visible={isModalOpen && modalType === "Create"}
					onCancel={handleCancel}
					onOk={handleOk}
					setData={setData}
					data={data}
				/>
				<ConfirmDelete
					executeAction={(element) => handleDelete(element)}
					modalType={modalType}
					text="Adulto mayor"
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

export default SeniorsPage
