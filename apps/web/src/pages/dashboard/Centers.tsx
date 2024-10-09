import React from "react"
import PageLayout from "../../layouts/PageLayout"
import FlowbiteCard from "../../components/ui/Card"
import UpdateCenter from "../../components/forms/update/Center"
import CreateCenter from "../../components/forms/create/Center"
import ConfirmAction from "../../components/ConfirmAction"

import { api } from "../../lib/axios"
import { Center } from "../../lib/types"
import { useModal } from "../../context/ModalContext"
import { Pagination } from "antd"
import { usePagination } from "../../hooks/usePagination"
import { useEffect, useState } from "react"

const CentersPage: React.FC = () => {
	const [data, setData] = useState<Center[]>([])
	const [loading, setLoading] = useState(true)

	const { showModal } = useModal()
	const { paginatedData, currentPage, pageSize, total, onPageChange } = usePagination({
		data,
		defaultPageSize: 6,
	})

	const fetchCenters = async () => {
		try {
			const response = await api.get("/dashboard/centers/")
			setData(response.data.values.centers)
		} catch (err) {
			console.error("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCenters()
	}, [])

	const handleDelete = async (center: any) => {
		try {
			const response = await api.delete(`/dashboard/centers/${center.id}`)
			return response
		} catch (error) {
			console.error("Error en el delete:", error)
		}
	}

	return (
		<PageLayout
			pageTitle="Centros de atención"
			create={true}
			data={data}
			setData={setData}
			searchKeys={["name", "address", "phone"]}
		>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-cols-3 gap-8">
					{paginatedData.map((center) => {
						const imageSrc = `${import.meta.env.VITE_API_URL}/storage/public/centers/${center.id}.webp`

						return (
							<FlowbiteCard
								onDelete={() => showModal("Confirm", center)}
								onUpdate={() => showModal("Edit", center)}
								key={center.id}
								title={center.name}
								description={center.address}
								other={`Teléfono: ${center.phone}`}
								imageSrcUrl={imageSrc}
							/>
						)
					})}
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

			<CreateCenter data={data} setData={setData} />
			<UpdateCenter data={data} setData={setData} />

			<ConfirmAction
				text="¿Estás seguro(a) de que deseas eliminar este centro de atención?"
				data={data}
				setData={setData}
				executeAction={(center) => handleDelete(center)}
			/>
		</PageLayout>
	)
}

export default CentersPage
