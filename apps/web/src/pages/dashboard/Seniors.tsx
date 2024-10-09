import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import CreateSenior from "../../components/forms/create/Senior"
import UpdateSenior from "../../components/forms/update/Senior"
import ConfirmAction from "../../components/ConfirmAction"

import { api } from "../../lib/axios"
import { Senior } from "../../lib/types"
import { useModal } from "../../context/ModalContext"
import { SeniorsColumns } from "../../lib/columns"
import { useState, useEffect } from "react"

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

	const { showModal } = useModal()

	return (
		<PageLayout
			pageTitle="Personas mayores"
			create={true}
			setData={setData}
			data={originalData}
			searchKeys={["id", "name", "email"]}
		>
			<DataTable<Senior>
				data={data}
				columnsConfig={SeniorsColumns}
				onEdit={(element) => showModal("Edit", element)}
				onDelete={(element) => showModal("Confirm", element)}
			/>
			<CreateSenior data={data} setData={setData} />
			<UpdateSenior data={data} setData={setData} />
			<ConfirmAction
				text="¿Estás seguro(a) de que deseas eliminar esta persona mayor?"
				data={data}
				setData={setData}
				executeAction={(element) => handleDelete(element)}
			/>
		</PageLayout>
	)
}

export default SeniorsPage
