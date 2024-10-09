import React from "react"
import PageLayout from "../../layouts/PageLayout"

import DataTable from "../../components/Table"
import ConfirmAction from "../../components/ConfirmAction"
import CreateProfessional from "../../components/forms/create/Professional"
import UpdateProfessional from "../../components/forms/update/Professional"

import { api } from "../../lib/axios"
import { useModal } from "../../context/ModalContext"
import { Professional } from "../../lib/types"
import { ProfessionalColumns } from "../../lib/columns"
import { useState, useEffect } from "react"

const ProfessionalsPage: React.FC = () => {
	const [data, setData] = useState<Professional[]>([])
	const [originalData, setOriginalData] = useState<Professional[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchProfessionals = async () => {
		try {
			const { data } = await api.get("/dashboard/professionals")
			setData(data.values.professionals)
			setOriginalData(data.values.professionals)
		} catch (err) {
			setError("Error al obtener los datos")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProfessionals()
	}, [])

	const handleDelete = async (professional: any) => {
		try {
			const response = await api.delete(`/dashboard/professionals/${professional.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	const { showModal } = useModal()

	return (
		<PageLayout
			pageTitle="Profesionales"
			create={true}
			data={originalData}
			setData={setData}
			searchKeys={["id", "name", "email"]}
		>
			<DataTable<Professional>
				data={data}
				columnsConfig={ProfessionalColumns}
				onEdit={(element) => showModal("Edit", element)}
				onDelete={(element) => showModal("Confirm", element)}
			/>
			<CreateProfessional data={data} setData={setData} />
			<UpdateProfessional data={data} setData={setData} />
			<ConfirmAction
				text="¿Estás seguro de que deseas eliminar este profesional?"
				data={data}
				setData={setData}
				executeAction={(element) => handleDelete(element)}
			/>
		</PageLayout>
	)
}

export default ProfessionalsPage
