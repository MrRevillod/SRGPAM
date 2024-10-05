import React from "react"
import PageLayout from "../../layouts/PageLayout"
import FlowbiteCard from "../../components/ui/Card"
import CreateService from "../../components/forms/create/Service"
import UpdateService from "../../components/forms/update/Service"
import ConfirmDelete from "../../components/ConfirmDelete"

import { api } from "../../lib/axios"
import { Service } from "../../lib/types"
import { useModal } from "../../hooks/modal"
import { Pagination } from "antd"
import { useState, useEffect } from "react"

const ServicesPage: React.FC = () => {
	const [data, setData] = useState<Service[]>([])
	const [originalData, setOriginalData] = useState<Service[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(6)

	const fetchServices = async () => {
		try {
			const response = await api.get("/dashboard/services/")
			setData(response.data.values.services)
			setOriginalData(response.data.values.services)
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

	const { isModalOpen, showModal, handleOk, handleCancel, modalType, selectedData } = useModal()

	return (
		<PageLayout
			pageTitle="Servicios"
			addFunction={() => showModal("Create", null)}
			setData={setData}
			data={originalData}
			searchKeys={["name"]}
		>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-cols-3 gap-8 h-full">
					{paginatedData.map((service) => (
						<FlowbiteCard
							onDelete={() => showModal("Delete", service)}
							onUpdate={() => showModal("Edit", service)}
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
				visible={isModalOpen && modalType === "Edit"}
				entity={selectedData}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
			/>

			<ConfirmDelete
				executeAction={handleDelete}
				text="Servicio"
				visible={isModalOpen && modalType === "Delete"}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
				selectedElement={selectedData}
			/>
		</PageLayout>
	)
}

export default ServicesPage
