import React, { useState, useEffect } from "react"
import axios from "axios"
import PersonTable from "../../components/Seniors-Table/Seniors-Table"
import EditPersonModal from "../../components/Edit-Seniors/Edit-Seniors"
import type { DataType } from "../../lib/types"

import "../../main.css"
import PageLayout from "../../layouts/PageLayout"

const SeniorsPage: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalType, setModalType] = useState("")
	const [selectedPerson, setSelectedPerson] = useState<DataType | null>(null)
	const [data, setData] = useState<DataType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchSeniors = async () => {
		try {
			const response = await axios.get("http://localhost/api/dashboard/seniors")
			console.log(response.data.values)

			const transformedData = response.data.values.map((senior: any) => ({
				id: senior.id,
				name: senior.name,
				email: senior.email,
				birthDate: senior.birthDate,
				address: senior.address,
			}))

			setData(transformedData)
		} catch (err) {
			setError("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSeniors()
	}, [])

	const showModal = (type: string, person: DataType) => {
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

	if (loading) {
		return <div>Cargando datos...</div>
	}

	if (error) {
		return <div>{error}</div>
	}

	return (
		<PageLayout pageTitle="Adultos mayores" addFunction={() => {}} setData={() => {}}>
			<>
				<PersonTable data={data} onEdit={(person) => showModal("Edit", person)} />
				<EditPersonModal
					visible={isModalOpen}
					person={selectedPerson}
					modalType={modalType}
					onCancel={handleCancel}
					onOk={handleOk}
				/>
			</>
		</PageLayout>
	)
}

export default SeniorsPage
