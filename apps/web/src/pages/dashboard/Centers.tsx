import React from "react"
import PageLayout from "../../layouts/PageLayout"
import FlowbiteCard from "../../components/ui/Card"
import UpdateCenter from "../../components/forms/update/Center"
import CreateCenter from "../../components/forms/create/Center"
import ConfirmAction from "../../components/ConfirmAction"

import { Center } from "../../lib/types"
import { useModal } from "../../context/ModalContext"
import { deleteCenter, getCenters } from "../../lib/actions"
import { useRequest } from "../../hooks/useRequest"
import { Pagination } from "antd"
import { usePagination } from "../../hooks/usePagination"
import { useEffect, useState } from "react"

const CentersPage: React.FC = () => {
	// Estado para almacenar los datos de los administradores
	// en el componente, para poder actualizarlos en tiempo real
	const [centers, setCenters] = useState<Center[]>([])

	const { error, loading, data } = useRequest<Center[]>({
		action: getCenters,
	})

	useEffect(() => {
		if (data) setCenters(data)
	}, [data])

	const { showModal } = useModal()
	const { paginatedData, currentPage, pageSize, total, onPageChange } = usePagination({
		data: centers,
		defaultPageSize: 6,
	})

	return (
		<PageLayout
			pageTitle="Centros de atención"
			create={true}
			data={data}
			setData={setCenters}
			searchKeys={["name", "address", "phone"]}
		>
			<section className="flex flex-col w-full h-full gap-8">
				<div className="grid grid-col-2 xl:grid-cols-3 gap-8">
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

			<CreateCenter data={centers} setData={setCenters} />
			<UpdateCenter data={centers} setData={setCenters} />

			<ConfirmAction<Center>
				text="¿Estás seguro(a) de que deseas eliminar este centro de atención?"
				data={centers}
				setData={setCenters}
				executeAction={deleteCenter}
			/>
		</PageLayout>
	)
}

export default CentersPage
