import React, { useState, useEffect } from "react"
import Modals from "../../components/Modal"
import DataTable from "../../components/Table"
import PageLayout from "../../layouts/PageLayout"

import { api } from "../../lib/axios"
import { Button } from "antd"
import { Senior, UnvalidatedSenior } from "../../lib/types"
import { UnvalidatedSeniorsColumns } from "../../lib/columns"

const NewSeniorsPage: React.FC = () => {
	const [data, setData] = useState<Senior[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedSenior, setSelectedSenior] = useState<Partial<Senior> | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchSeniors = async () => {
		try {
			const response = await api.get("/dashboard/seniors/new")
			setData(response.data.values.seniors)
		} catch (err) {
			console.log(err)
			console.error("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSeniors()
	}, [])

	const handleValidate = async (validate: boolean) => {
		if (selectedSenior && selectedSenior.id) {
			try {
				const url = `/dashboard/seniors/${selectedSenior.id}/new?validate=${validate}`
				await api.patch(url)

				setData((prevData) =>
					prevData.map((senior) =>
						senior.id === selectedSenior.id ? { ...senior, validated: validate } : senior
					)
				)

				handleCloseModal()
			} catch (error) {
				console.error("Error al actualizar el usuario:", error)
			}
		}
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedSenior(null)
	}

	// Añadir Onvalidate a las props de la tabla, y ahí renderizar el enlace
	// a la página de validación singular por cada senior !TODO

	return (
		<PageLayout pageTitle="Solicitudes de registro nuevos adultos mayores">
			<DataTable<UnvalidatedSenior> data={data} columnsConfig={UnvalidatedSeniorsColumns} />

			<Modals
				title="Edit Senior Details"
				isVisible={isModalOpen}
				onOk={() => handleValidate(true)}
				onCancel={handleCloseModal}
				footer={[
					<Button key="update" onClick={() => handleValidate(true)}>
						Aceptar
					</Button>,
					<Button key="delete" danger onClick={() => handleValidate(false)}>
						Denegar
					</Button>,
				]}
			>
				{selectedSenior && (
					<div>
						<p>
							<strong>Nombre: </strong>
							{selectedSenior.name}
						</p>
						<p>
							<strong>Correo Electrónico: </strong>
							{selectedSenior.email}
						</p>
						<p>
							<strong>Dirección: </strong>
							{selectedSenior.address}
						</p>
						<p>
							<strong>Fecha de Nacimiento: </strong>
							{new Date(selectedSenior.birthDate as string).toLocaleDateString()}
						</p>
						<p>
							<strong>Verificado: </strong>
							{selectedSenior.validated ? "Yes" : "No"}
						</p>
					</div>
				)}
			</Modals>
		</PageLayout>
	)
}

export default NewSeniorsPage
