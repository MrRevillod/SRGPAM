import React, { useState, useEffect } from "react"
import axios from "axios"
import PersonTable from "../../components/Table"
import EditPersonModal from "../../components/forms/Edit-Seniors"
import CreateSeniors from "../../components/forms/Create-Seniors"
import type { DataType } from "../../lib/types"
import { columnsConfig } from "../../lib/table-columns"
import "../../main.css"
import PageLayout from "../../layouts/PageLayout"

const SeniorsPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedPerson, setSelectedPerson] = useState<DataType | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<DataType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchSeniors = async () => {
		try {
			const response = await axios.get("http://localhost/api/dashboard/seniors")
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

	const showModal = (type: string, person: DataType | null) => {
		setModalType(type)
		setSelectedPerson(person)
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
			<>
				<PersonTable data={data} columnsConfig={columnsConfig} onEdit={(person) => showModal("Edit", person)} />
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
			</>
		</PageLayout>
	)
}

export default SeniorsPage
