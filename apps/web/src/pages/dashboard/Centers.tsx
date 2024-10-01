import { api } from "../../lib/axios"
import { Center } from "../../lib/types"
import { Pagination } from "antd"

import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import FlowbiteCard from "../../components/ui/Card"
import UpdateCenter from "../../components/forms/update/Center"
import CreateCenter from "../../components/forms/create/Center"
import ConfirmDelete from "../../components/ConfirmDelete"

const CentersPage: React.FC = () => {
	const [modalType, setModalType] = useState("")
	const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [data, setData] = useState<Center[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(6)

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

	const showModal = (type: string, center: any) => {
		setModalType(type)
		setSelectedCenter(center)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}
	return (
		<PageLayout pageTitle="Centros de atención" addFunction={() => showModal("Create", null)} setData={() => {}}>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-cols-3 gap-8">
					{paginatedData.map((center) => {
						return (
							<FlowbiteCard
								onDelete={() => showModal("Delete", center)}
								onUpdate={() => showModal("Update", center)}
								key={center.id}
								title={center.name}
								description={center.address}
								other={`Teléfono: ${center.phone}`}
							/>
						)
					})}
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

			<CreateCenter
				visible={isModalOpen && modalType === "Create"}
				onCancel={handleCancel}
				onOk={handleOk}
				setData={setData}
				data={data}
			/>

			<UpdateCenter
				visible={isModalOpen && modalType === "Update"}
				entity={selectedCenter}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
			/>

			<ConfirmDelete
				modalType="Delete"
				text="Centro de atención"
				visible={isModalOpen && modalType === "Delete"}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
				selectedElement={selectedCenter}
				executeAction={handleDelete}
			/>
		</PageLayout>
	)
}

export default CentersPage
