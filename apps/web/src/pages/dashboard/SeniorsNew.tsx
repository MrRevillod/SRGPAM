import axios from "axios"
import React, { useState, useEffect } from "react"
import PageLayout from "../../layouts/PageLayout"
import Modals from "../../components/Modal"
import PersonTable from "../../components/Table"
import { DataType } from "../../lib/types"
import { Button } from "antd"
import { columnsConfig } from "../../lib/table-columns"

const NewSeniorsPage: React.FC = () => {
	const [data, setData] = useState<DataType[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedSenior, setSelectedSenior] = useState<DataType | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const fetchSeniors = async () => {
		try {
			const response = await axios.get("http://localhost/api/dashboard/seniors/new")
			setData(response.data.values.seniors)
		} catch (err) {
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
				const url = `http://localhost/api/dashboard/seniors/${selectedSenior.id}/new?validate=${validate}`
				await axios.patch(url)

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

	const handleOpenModal = (senior: DataType) => {
		setSelectedSenior(senior)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedSenior(null)
	}

	return (
		<PageLayout pageTitle="Solicitudes de registro nuevo adultos mayores">
			<PersonTable
				data={data}
				columnsConfig={columnsConfig} // Usa el columnsConfig importado
				onEdit={handleOpenModal}
			/>

			{/* Modal personalizado para editar los detalles del senior */}
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
							{new Date(selectedSenior.birthDate).toLocaleDateString()}
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
