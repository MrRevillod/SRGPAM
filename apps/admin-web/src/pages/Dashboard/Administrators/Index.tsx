// App.tsx
import React, { useState } from "react"
import PersonTable from "../../../components/Seniors-Table/Seniors-Table"
import EditPersonModal from "../../../components/Edit-Seniors/Edit-Seniors"
import type { DataType } from "../../../types"

const App: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalType, setModalType] = useState("")
	const [selectedPerson, setSelectedPerson] = useState<DataType | null>(null)

	const showModal = (type: string, person: DataType) => {
		setModalType(type)
		setSelectedPerson(person)
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
		setSelectedPerson(null)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setSelectedPerson(null)
	}

	const data: DataType[] = [
		{ key: "1", name: "John Brown", age: 62, email: "john.brown@hotmail.com", password: "1234" },
		{ key: "2", name: "Jim Green", age: 72, email: "jim.green@gmail.com", password: "1234" },
		{ key: "3", name: "Joe Black", age: 63, email: "joe.black@gmail.com", password: "1234" },
	]

	return (
		<>
			<PersonTable data={data} onEdit={(person) => showModal("Edit", person)} onDelete={(person) => showModal("Delete", person)} />
			<EditPersonModal visible={isModalOpen} person={selectedPerson} modalType={modalType} onCancel={handleCancel} onOk={handleOk} />
		</>
	)
}

export default App
