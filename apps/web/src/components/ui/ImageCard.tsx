import React, { useEffect, useState } from "react"
import { MenuProps, Dropdown, Button } from "antd"
import { IMAGE_BASE_URL } from "../../lib/axios"
import { useModal } from "../../context/ModalContext"

interface ImageCardProps {
	title: string
	other?: string
	description: string
	imagePath?: string
	updatable?: boolean
	deletable?: boolean
	item: any
}

export const ImageCard = ({ imagePath, title, description, other, updatable, deletable, item }: ImageCardProps) => {
	const [imageSrc, setImagePath] = useState<string>(`${IMAGE_BASE_URL}${imagePath}/${item.id}.webp`)
	const { showModal, cachedData, modalType, isModalOpen } = useModal()

	useEffect(() => {
		if (!isModalOpen && modalType === "Edit" && cachedData?.id === item?.id) {
			setImagePath(`${imageSrc}?${Date.now()}`)
		}
	}, [isModalOpen, cachedData])

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
		<div className="relative overflow-hidden bg-opacity-50 rounded-lg shadow-lg max-w-2xl mx-auto w-full max-h-[280px]">
			<div
				className="absolute inset-0 bg-cover bg-center z-0"
				style={{ backgroundImage: `url(${imageSrc})` }}
				aria-hidden="false"
			/>
			<div className="-mt-4 relative bg-black bg-opacity-50 min-h-[300px] p-8 flex flex-col justify-end z-10">
				<div className="flex flex-row justify-between items-center w-full">
					<h2 className="text-3xl font-bold text-white mb-2 truncate" title={title}>
						{title}
					</h2>
					<Dropdown trigger={["click"]} menu={{ items: menuItems }} placement="bottomRight">
						<div className="flex flex-col justify-between gap-1 cursor-pointer p-4 ml-2">
							<div className="w-1 h-1 bg-gray-light rounded-full"></div>
							<div className="w-1 h-1 bg-gray-light rounded-full"></div>
							<div className="w-1 h-1 bg-gray-light rounded-full"></div>
						</div>
					</Dropdown>
				</div>
				<p className="text-gray-light mb-4">{description}</p>
				{other && <p className="text-gray-light">{other}</p>}
			</div>
		</div>
	)
}
