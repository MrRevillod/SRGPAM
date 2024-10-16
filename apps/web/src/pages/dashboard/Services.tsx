import React from "react"
import PageLayout from "../../layouts/PageLayout"
import CreateService from "../../components/forms/create/Service"
import UpdateService from "../../components/forms/update/Service"
import ConfirmDelete from "../../components/ConfirmAction"

import { ImageCard } from "../../components/ui/ImageCard"
import { message } from "antd"
import { Service } from "../../lib/types"
import { CardLayout } from "../../components/CardLayout"
import { useRequest } from "../../hooks/useRequest"
import { useEffect, useState } from "react"
import { deleteService, getServices } from "../../lib/actions"

const ServicesPage: React.FC = () => {
	const [services, setServices] = useState<Service[]>([])

	const { error, loading, data } = useRequest<Service[]>({
		action: getServices,
	})

	useEffect(() => {
		if (data) setServices(data)
	}, [data])

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout pageTitle="Servicios" create data={data} setData={setServices} searchKeys={["name"]}>
			<CardLayout<Service>
				data={services}
				loading={loading}
				renderCard={(service: Service) => (
					<ImageCard
						key={service.id}
						item={service}
						title={service.name}
						description={service.description}
						imagePath={`/services`}
						deletable
						updatable
					/>
				)}
			/>

			<CreateService data={services} setData={setServices} />
			<UpdateService data={services} setData={setServices} />
			<ConfirmDelete<Service>
				text="¿Estás seguro(a) de que deseas eliminar este servicio?"
				data={services}
				setData={setServices}
				action={deleteService}
			/>
		</PageLayout>
	)
}

export default ServicesPage
