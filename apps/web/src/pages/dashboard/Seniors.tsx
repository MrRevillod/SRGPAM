import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import CreateSenior from "../../components/forms/create/Senior"
import UpdateSenior from "../../components/forms/update/Senior"
import ConfirmAction from "../../components/ConfirmAction"

import { Senior } from "../../lib/types"
import { message } from "antd"
import { useRequest } from "../../hooks/useRequest"
import { SeniorsColumns } from "../../lib/columns"
import { useState, useEffect } from "react"
import { deleteSenior, getSeniors } from "../../lib/actions"

const SeniorsPage: React.FC = () => {
	const [seniors, setSeniors] = useState<Senior[]>([])

	const { error, loading, data } = useRequest<Senior[]>({
		action: getSeniors,
	})

	useEffect(() => {
		if (data) setSeniors(data)
	}, [data])

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout
			pageTitle="Personas mayores"
			create
			data={data}
			setData={setSeniors}
			searchKeys={["id", "name", "email"]}
		>
			<DataTable<Senior>
				data={seniors}
				columnsConfig={SeniorsColumns}
				editable
				deletable
				loading={loading}
				viewable={false}
			/>

			<CreateSenior data={seniors} setData={setSeniors} />
			<UpdateSenior data={seniors} setData={setSeniors} />

			<ConfirmAction<Senior>
				text="¿Estás seguro(a) de que deseas eliminar esta persona mayor?"
				data={seniors}
				setData={setSeniors}
				action={deleteSenior}
			/>
		</PageLayout>
	)
}

export default SeniorsPage
