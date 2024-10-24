import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"

import { message } from "antd"
import { useRequest } from "../../hooks/useRequest"
import { getSeniors } from "../../lib/actions"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Senior, UnvalidatedSenior } from "../../lib/types"
import { UnvalidatedSeniorsColumns } from "../../lib/columns"

const NewSeniorsPage: React.FC = () => {
	const [seniors, setSeniors] = useState<Senior[]>([])
	const navigate = useNavigate()

	const { error, loading, data } = useRequest<Senior[]>({
		action: getSeniors,
		query: "validated=0",
		onSuccess: (data) => setSeniors(data),
	})

	if (error) message.error("Error al cargar los datos")

	const handleView = (senior: UnvalidatedSenior) => {
		navigate(`/personas-mayores/solicitud-de-registro`, {
			state: { senior },
		})
	}

	return (
		<PageLayout pageTitle="Solicitudes de registro de personas mayores">
			<DataTable<UnvalidatedSenior>
				data={seniors}
				loading={loading}
				onView={handleView}
				viewable
				columnsConfig={UnvalidatedSeniorsColumns}
			/>
		</PageLayout>
	)
}

export default NewSeniorsPage
