import React from "react"
import PageLayout from "../../layouts/PageLayout"
import FlowbiteCard from "../../components/ui/Card"
import CreateService from "../../components/forms/create/Service"
import UpdateService from "../../components/forms/update/Service"
import ConfirmDelete from "../../components/ConfirmAction"

import { api } from "../../lib/axios"
import { Service } from "../../lib/types"
import { useModal } from "../../context/ModalContext"
import { Pagination } from "antd"
import { usePagination } from "../../hooks/usePagination"
import { useEffect, useState } from "react"

const ServicesPage: React.FC = () => {
	const [data, setData] = useState<Service[]>([])
	const [loading, setLoading] = useState(true)

	const { showModal } = useModal()

	const { paginatedData, currentPage, pageSize, total, onPageChange } = usePagination({
		data,
		defaultPageSize: 6,
	})

	const fetchServices = async () => {
		try {
			const response = await api.get("/dashboard/services/")
			setData(response.data.values.services)
		} catch (err) {
			console.log(err)
			console.error("Error al obtener los datos de servicios")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchServices()
	}, [])

	const handleDelete = async (element: any) => {
		try {
			const response = await api.delete(`/dashboard/services/${element.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	return (
		<PageLayout pageTitle="Servicios" create={true} setData={setData} data={data} searchKeys={["name"]}>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-cols-3 gap-8 h-full">
					{paginatedData.map((service) => (
						<FlowbiteCard
							onDelete={() => showModal("Confirm", service)}
							onUpdate={() => showModal("Edit", service)}
							key={service.id}
							title={service.name}
							description={service.description}
							imageSrcUrl={`${import.meta.env.VITE_API_URL}/storage/public/services/${service.id}.webp`}
						/>
					))}
				</div>

				<Pagination
					defaultPageSize={6}
					pageSizeOptions={["6", "12", "24", "48"]}
					current={currentPage}
					pageSize={pageSize}
					total={total}
					onChange={onPageChange}
					size="default"
					align="end"
				/>
			</section>

			<CreateService data={data} setData={setData} />
			<UpdateService data={data} setData={setData} />
			<ConfirmDelete
				text="¿Estás seguro(a) de que deseas eliminar este servicio?"
				data={data}
				setData={setData}
				executeAction={(element) => handleDelete(element)}
			/>
		</PageLayout>
	)
}

export default ServicesPage
