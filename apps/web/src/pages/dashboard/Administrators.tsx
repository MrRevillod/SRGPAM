import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import ConfirmAction from "../../components/ConfirmAction"
import UpdateAdministrator from "../../components/forms/update/Administrator"
import CreateAdministrator from "../../components/forms/create/Administrator"

import { api } from "../../lib/axios"
import { useModal } from "../../context/ModalContext"
import { Administrator } from "../../lib/types"
import { AdministratorColumns } from "../../lib/columns"
import { useState, useEffect, Fragment } from "react"

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

	const handleDelete = async (administrator: any) => {
		try {
			const response = await api.delete(`/dashboard/administrators/${administrator.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	const { showModal } = useModal()

	return (
		<PageLayout
			pageTitle="Administradores"
			create={true}
			data={originalData}
			setData={setData}
			searchKeys={["id", "name", "email"]}
		>
			<DataTable<Administrator>
				data={data}
				columnsConfig={AdministratorColumns}
				onEdit={(element) => showModal("Edit", element)}
				onDelete={(element) => showModal("Confirm", element)}
			/>
			<CreateAdministrator data={data} setData={setData} />
			<UpdateAdministrator data={data} setData={setData} />
			<ConfirmAction
				text="¿Estás seguro(a) de que deseas eliminar este usuario?"
				data={data}
				setData={setData}
				executeAction={(element) => handleDelete(element)}
			/>
		</PageLayout>
	)
}

export default AdministratorsPage
