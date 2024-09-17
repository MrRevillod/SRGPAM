import axios from "axios"
import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, Button } from "flowbite-react"

interface Senior {
	id: string
	name: string
	email: string
	birthDate: string
	address: string
	validated: boolean
}

const SeniorsPage: React.FC = () => {
	const [data, setData] = useState<Senior[]>([]) // Estado para los datos de seniors
	const [loading, setLoading] = useState(true) // Estado de carga
	const [error, setError] = useState<string | null>(null) // Estado para el error
	const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null) // Senior seleccionado
	const [isModalOpen, setIsModalOpen] = useState(false) // Estado para controlar la apertura del modal

	const fetchSeniors = async () => {
		try {
			const response = await axios.get("http://localhost/api/dashboard/seniors/new")
			const transformedData = response.data.values.seniors.map((senior: any) => ({
				id: senior.id,
				name: senior.name,
				email: senior.email,
				birthDate: senior.birthDate,
				address: senior.address,
				validated: senior.validated,
			}))
			setData(transformedData)
		} catch (err) {
			setError("Error al obtener los datos de seniors")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSeniors()
	}, [])

	const handleOpenModal = (senior: Senior) => {
		setSelectedSenior(senior)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedSenior(null)
	}

	const handleUpdate = async () => {
		if (selectedSenior && selectedSenior.id) {
			try {
				const url = `http://localhost/api/dashboard/seniors/${selectedSenior.id}/new?validated=true`
				await axios.patch(url)

				setData((prevData) =>
					prevData.map((senior) =>
						senior.id === selectedSenior.id ? { ...senior, validated: true } : senior
					)
				)
				handleCloseModal()
			} catch (error) {
				console.error("Error al actualizar el usuario:", error)
			}
		}
	}

	const handleDelete = async () => {
		if (selectedSenior && selectedSenior.id) {
			try {
				await axios.delete(`http://localhost:5000/api/dashboard/seniors/${selectedSenior.id}`)
				setData((prevData) => prevData.filter((senior) => senior.id !== selectedSenior.id))
				handleCloseModal()
			} catch (error) {
				console.error("Error al eliminar el usuario:", error)
			}
		}
	}

	return (
		<div className="overflow-x-auto">
			<Table hoverable>
				<TableHead>
					<TableHeadCell>ID</TableHeadCell>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Address</TableHeadCell>
					<TableHeadCell>Birth Date</TableHeadCell>
					<TableHeadCell>Validated</TableHeadCell>
					<TableHeadCell>
						<span className="sr-only">Edit</span>
					</TableHeadCell>
				</TableHead>
				<TableBody className="divide-y">
					{Array.isArray(data) ? (
						data.map((senior) => (
							<TableRow key={senior.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
								<TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
									{senior.id}
								</TableCell>
								<TableCell>{senior.name}</TableCell>
								<TableCell>{senior.email}</TableCell>
								<TableCell>{senior.address}</TableCell>
								<TableCell>{new Date(senior.birthDate).toLocaleDateString()}</TableCell>
								<TableCell>{senior.validated ? "Yes" : "No"}</TableCell>
								<TableCell>
									<a
										href="#"
										onClick={() => handleOpenModal(senior)}
										className="text-cyan-600 hover:underline dark:text-cyan-500"
									>
										Edit
									</a>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={7}>No data available</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Modal para editar los detalles del senior */}
			<Modal dismissible show={isModalOpen} onClose={handleCloseModal}>
				<Modal.Header>Edit Senior Details</Modal.Header>
				<Modal.Body>
					{selectedSenior && (
						<div className="space-y-6">
							<p>
								<strong>Name: </strong>
								{selectedSenior.name}
							</p>
							<p>
								<strong>Email: </strong>
								{selectedSenior.email}
							</p>
							<p>
								<strong>Address: </strong>
								{selectedSenior.address}
							</p>
							<p>
								<strong>Birth Date: </strong>
								{new Date(selectedSenior.birthDate).toLocaleDateString()}
							</p>
							<p>
								<strong>Validated: </strong>
								{selectedSenior.validated ? "Yes" : "No"}
							</p>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button color="light" onClick={handleUpdate}>
						Aceptar
					</Button>
					<Button color="failure" onClick={handleDelete}>
						Denegar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default SeniorsPage
