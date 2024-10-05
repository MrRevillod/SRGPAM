import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"

import { api } from "../../lib/axios"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Senior, UnvalidatedSenior } from "../../lib/types"
import { UnvalidatedSeniorsColumns } from "../../lib/columns"

const NewSeniorsPage: React.FC = () => {
	const [data, setData] = useState<Senior[]>([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	const fetchSeniors = async () => {
		try {
			const response = await api.get("/dashboard/seniors/new")
			setData(response.data.values.seniors)
		} catch (err) {
			console.log(err)
			console.error("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSeniors()
	}, [])

	const handleView = (senior: UnvalidatedSenior) => {
		navigate(`/dashboard/personas-mayores/solicitud-de-registro`, { state: { senior } })
	}

	return (
		<PageLayout pageTitle="Solicitudes de registro de personas mayores">
			<DataTable<UnvalidatedSenior> data={data} onView={handleView} columnsConfig={UnvalidatedSeniorsColumns} />
		</PageLayout>
	)
}

export default NewSeniorsPage
