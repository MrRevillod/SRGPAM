import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios"
import { Service } from "../../lib/types"
import FlowbiteCard from "../../components/ui/Card"
import CreateService from "../../components/forms/create/Service"
import UpdateService from "../../components/forms/update/Service"
import { Pagination } from "antd"
import ConfirmDelete from "../../components/ConfirmDelete"

const ServicesPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<Service[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(6)

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

	const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

	const onPageChange = (page: number, size: number) => {
		setCurrentPage(page)
		setPageSize(size)
	}

	const showModal = (type: string, element: Service | null) => {
		setModalType(type)
		setSelectedService(element)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
		setSelectedService(null)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setSelectedService(null)
	}

	return (
		<PageLayout pageTitle="Servicios" addFunction={() => showModal("Create", null)} setData={() => {}}>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-cols-3 gap-8 h-full">
					{paginatedData.map((service) => (
						<FlowbiteCard
							onDelete={() => showModal("Delete", service)}
							onUpdate={() => showModal("Update", service)}
							key={service.id}
							title={service.name}
							description={service.description}
						/>
					))}
				</div>

				<Pagination
					defaultPageSize={6}
					pageSizeOptions={["6", "12", "24", "48"]}
					current={currentPage}
					pageSize={pageSize}
					total={data.length}
					onChange={onPageChange}
					size="default"
					align="end"
				/>
			</section>

			<CreateService
				visible={isModalOpen && modalType === "Create"}
				onCancel={handleCancel}
				onOk={handleOk}
				setData={setData}
				data={data}
			/>

			<UpdateService
				visible={isModalOpen && modalType === "Update"}
				entity={selectedService}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
			/>

			<ConfirmDelete
				executeAction={handleDelete}
				modalType="Delete"
				text="Servicio"
				visible={isModalOpen && modalType === "Delete"}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
				selectedElement={selectedService}
			/>
		</PageLayout>
	)
}

export default ServicesPage
