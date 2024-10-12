import React from "react"
import { useModal } from "../../context/ModalContext"
import { IMAGE_BASE_URL } from "../../lib/axios"
import { useEffect, useState } from "react"
import { Dropdown, MenuProps, Button } from "antd"

interface Props {
	item: any
	title: string
	description: string
	other?: string
	updatable?: boolean
	deletable?: boolean
	imageSrc?: string
}

export const Card: React.FC<Props> = ({ item, title, description, other, updatable, deletable, imageSrc }) => {
	const [imageUrl, setImageUrl] = useState<string>(`${IMAGE_BASE_URL}${imageSrc}`)
	const { showModal, isModalOpen, modalType, selectedData } = useModal()

	useEffect(() => {
		if (!isModalOpen && modalType === "Edit") {
			setImageUrl(`${IMAGE_BASE_URL}${imageSrc}?`)
		}
	}, [isModalOpen, selectedData])

	const menuItems: MenuProps["items"] = [
		updatable && {
			key: "edit",
			label: <span onClick={() => showModal("Edit", item)}>Editar</span>,
		},
		deletable && {
			key: "delete",
			label: <span onClick={() => showModal("Confirm", item)}>Eliminar</span>,
		},
	].filter(Boolean) as MenuProps["items"]

	return (
		<div className="w-full border-1 border-gray dark:border-gray-medium rounded-lg overflow-hidden shadow-lg flex">
			<img className="w-4/12 h-full object-cover" src={imageUrl} alt={title} />
			<div className="py-8 pl-8 pr-12 w-8/12 flex flex-col justify-between">
				<div className="flex flex-col items-start gap-6">
					<div className="flex flex-row justify-between items-center w-full">
						<h5 className="text-xl font-bold text-dark dark:text-light w-11/12">{title}</h5>

						<Dropdown menu={{ items: menuItems }} placement="bottom">
							<Button type="text" className="p-0">
								<div className="flex flex-col justify-between gap-1 cursor-pointer p-4">
									<div className="w-1 h-1 bg-gray-800 rounded-full"></div>
									<div className="w-1 h-1 bg-gray-800 rounded-full"></div>
									<div className="w-1 h-1 bg-gray-800 rounded-full"></div>
								</div>
							</Button>
						</Dropdown>
					</div>
					<p className="font-normal text-gray-dark dark:text-gray-light">{description}</p>
				</div>

				{other && <p className="mt-2">{other}</p>}
			</div>
		</div>
	)
}
