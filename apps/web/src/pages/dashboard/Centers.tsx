import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios"
import { Center } from "../../lib/types"
import FlowbiteCard from "../../components/ui/Card"
const CentersPage: React.FC = () => {
	const [data, setData] = useState<Center[]>([])
	const [loading, setLoading] = useState(true)

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

	return (
		<PageLayout pageTitle="Servicios" addFunction={() => {}} setData={() => {}}>
			<div className="grid grid-cols-3 gap-2 ">
				{data.map((center) => {
					return (
						<FlowbiteCard
							key={center.id}
							title={center.name}
							description={center.address}
							other={`Telefono : ${center.phone}`}
						/>
					)
				})}
			</div>
		</PageLayout>
	)
}

export default CentersPage
