import React from "react"
import PageLayout from "../../layouts/PageLayout"
import UpdateCenter from "../../components/forms/update/Center"
import CreateCenter from "../../components/forms/create/Center"
import ConfirmAction from "../../components/ConfirmAction"

import { Card } from "../../components/ui/Card"
import { Center } from "../../lib/types"
import { message } from "antd"
import { CardLayout } from "../../components/CardLayout"
import { useRequest } from "../../hooks/useRequest"
import { useEffect, useState } from "react"
import { deleteCenter, getCenters } from "../../lib/actions"

const CentersPage: React.FC = () => {
	const [centers, setCenters] = useState<Center[]>([])
	const { error, loading, data } = useRequest<Center[]>({
		action: getCenters,
	})

	useEffect(() => {
		if (data) setCenters(data)
	}, [data])

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout
			pageTitle="Centros de atención"
			create
			data={data}
			setData={setCenters}
			searchKeys={["name", "address", "phone"]}
		>
			<CardLayout<Center>
				data={centers}
				loading={loading}
				itemsPerPage={9}
				renderCard={(center: Center) => (
					<Card
						key={center.id}
						item={center}
						title={center.name}
						description={center.address}
						other={`Teléfono: ${center.phone}`}
						imageSrc={`/centers/${center.id}.webp`}
						deletable
						updatable
					/>
				)}
			/>

			<CreateCenter data={centers} setData={setCenters} />
			<UpdateCenter data={centers} setData={setCenters} />

			<ConfirmAction<Center>
				text="¿Estás seguro(a) de que deseas eliminar este centro de atención?"
				data={centers}
				setData={setCenters}
				action={deleteCenter}
			/>
		</PageLayout>
	)
}

export default CentersPage
