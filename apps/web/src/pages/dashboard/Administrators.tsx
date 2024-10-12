import React from "react"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"
import ConfirmAction from "../../components/ConfirmAction"
import UpdateAdministrator from "../../components/forms/update/Administrator"
import CreateAdministrator from "../../components/forms/create/Administrator"

import { message } from "antd"
import { useRequest } from "../../hooks/useRequest"
import { Administrator } from "../../lib/types"
import { useState, useEffect } from "react"
import { AdministratorColumns } from "../../lib/columns"
import { deleteAdministrator, getAdministrators } from "../../lib/actions"

const AdministratorsPage: React.FC = () => {
	const [administrators, setAdministrators] = useState<Administrator[]>([])

	const { error, loading, data } = useRequest<Administrator[]>({
		action: getAdministrators,
	})

	useEffect(() => {
		if (data) setAdministrators(data)
	}, [data])

	if (error) {
		message.error("Error al cargar los datos")
	}

	return (
		<PageLayout
			pageTitle="Administradores"
			create={true}
			data={data}
			setData={setAdministrators}
			searchKeys={["id", "name", "email"]}
		>
			<DataTable<Administrator>
				editable
				deletable
				loading={loading}
				data={administrators}
				columnsConfig={AdministratorColumns}
			/>

			<CreateAdministrator data={administrators} setData={setAdministrators} />
			<UpdateAdministrator data={administrators} setData={setAdministrators} />

			<ConfirmAction<Administrator>
				text="¿Estás seguro(a) de que deseas eliminar este usuario?"
				data={administrators}
				setData={setAdministrators}
				executeAction={deleteAdministrator}
			/>
		</PageLayout>
	)
}

export default AdministratorsPage
