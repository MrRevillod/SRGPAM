import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios"
import { Service } from "../../lib/types"
import FlowbiteCard from "../../components/ui/Card"
import CreateService from "../../components/forms/Create-Services"
import ConfirmDelete from "../../components/ConfirmDelete"
import EditServiceModal from "../../components/forms/Edit-Services"
import { Pagination } from "antd"

const ServicesPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<Service[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

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
			<div className="grid grid-cols-3 gap-2">
				{paginatedData.map((service) => (
					<FlowbiteCard
						onDelete={() => {}}
						onUpdate={() => {}}
						key={service.id}
						title={service.name}
						description={service.description}
					/>
				))}
			</div>

			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={data.length}
				onChange={onPageChange}
				showSizeChanger
			/>
			<CreateService
				visible={isModalOpen && modalType === "Create"}
				onCancel={handleCancel}
				onOk={handleOk}
				setData={setData}
				data={data}
			/>
		</PageLayout>
	)
}

export default ServicesPage
