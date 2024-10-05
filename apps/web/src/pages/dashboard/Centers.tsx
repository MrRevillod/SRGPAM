import React from "react"
import PageLayout from "../../layouts/PageLayout"
import FlowbiteCard from "../../components/ui/Card"
import UpdateCenter from "../../components/forms/update/Center"
import CreateCenter from "../../components/forms/create/Center"
import ConfirmDelete from "../../components/ConfirmDelete"

import { api } from "../../lib/axios"
import { Center } from "../../lib/types"
import { useModal } from "../../hooks/modal"
import { Pagination } from "antd"
import { useState, useEffect } from "react"

const CentersPage: React.FC = () => {
	const [data, setData] = useState<Center[]>([])
	const [originalData, setOriginalData] = useState<Center[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(6)

	const fetchCenters = async () => {
		try {
			const response = await api.get("/dashboard/centers/")
			setData(response.data.values.centers)
			setOriginalData(response.data.values.centers)
		} catch (err) {
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

	const { isModalOpen, showModal, handleOk, handleCancel, modalType, selectedData } = useModal()

	return (
		<PageLayout
			pageTitle="Centros de atención"
			addFunction={() => showModal("Create", null)}
			data={originalData}
			setData={setData}
			searchKeys={["name", "address", "phone"]}
		>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-cols-3 gap-8">
					{paginatedData.map((center) => {
						return (
							<FlowbiteCard
								onDelete={() => showModal("Delete", center)}
								onUpdate={() => showModal("Edit", center)}
								key={center.id}
								title={center.name}
								description={center.address}
								other={`Teléfono: ${center.phone}`}
								imageSrcUrl={`http://localhost/api/storage/public/centers/${center.id}.webp`}
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
				visible={isModalOpen && modalType === "Edit"}
				entity={selectedData}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
			/>

			<ConfirmDelete
				text="Centro de atención"
				visible={isModalOpen && modalType === "Delete"}
				onCancel={handleCancel}
				onOk={handleOk}
				data={data}
				setData={setData}
				selectedElement={selectedData}
				executeAction={handleDelete}
			/>
		</PageLayout>
	)
}

export default CentersPage
