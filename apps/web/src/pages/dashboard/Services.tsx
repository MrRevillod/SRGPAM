import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios"
import { Service } from "../../lib/types"
import FlowbiteCard from "../../components/ui/Card"
import { Pagination } from "antd"

const ServicesPage: React.FC = () => {
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

	const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

	const onPageChange = (page: number, size: number) => {
		setCurrentPage(page)
		setPageSize(size)
	}

	return (
		<PageLayout pageTitle="Servicios" addFunction={() => {}} setData={() => {}}>
			<div className="grid grid-cols-3 gap-2">
				{paginatedData.map((service) => (
					<FlowbiteCard key={service.id} title={service.title} description={service.description} />
				))}
			</div>

			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={data.length}
				onChange={onPageChange}
				showSizeChanger
			/>
		</PageLayout>
	)
}

export default ServicesPage
