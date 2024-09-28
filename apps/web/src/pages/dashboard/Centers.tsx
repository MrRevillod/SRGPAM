import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios"
import { Center } from "../../lib/types"
import FlowbiteCard from "../../components/ui/Card"
import { Pagination } from "antd"
import CreateCenter from "../../components/forms/Create-Centers"
const CentersPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedService] = useState<Center | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<Center[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const fetchCenters = async () => {
		try {
			const response = await api.get("/dashboard/centers/")
			setData(response.data.values.centers)
		} catch (err) {
			console.log(err)
			console.error("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		fetchCenters()
	}, [])
	const handleDelete = async (element: any) => {
		try {
			const response = await api.delete(`/dashboard/centers/${element.id}`)
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

	const showModal = (type: string) => {
		setModalType(type)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}
	return (
		<PageLayout pageTitle="Centros" addFunction={() => showModal("Create")} setData={() => {}}>
			<div className="grid grid-cols-3 gap-2 ">
				{paginatedData.map((center) => {
					return (
						<FlowbiteCard
							onDelete={() => {}}
							onUpdate={() => {}}
							key={center.id}
							title={center.name}
							description={center.address}
							other={`Teléfono: ${center.phone}`}
						/>
					)
				})}
			</div>

			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={data.length}
				onChange={onPageChange}
				showSizeChanger
			/>

			<CreateCenter
				visible={isModalOpen && modalType === "Create"}
				onCancel={handleCancel}
				onOk={handleOk}
				setData={setData}
				data={data}
			/>
		</PageLayout>
	)
}

export default CentersPage
