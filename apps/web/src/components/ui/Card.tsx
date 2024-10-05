import React, { useEffect, useState } from "react"
import { Dropdown } from "flowbite-react"
import axios from "axios"
import { useImage } from "../../hooks/image"

interface Props {
	title: string
	description: string
	imageSrcUrl?: string
	other?: string
	onDelete: () => void | Promise<void>
	onUpdate: () => void | Promise<void>
}

const Card: React.FC<Props> = ({ title, description, imageSrcUrl, other, onUpdate, onDelete }) => {
	const [imageSrc, setImageSrc] = useState<string | null>(null)

	useEffect(() => {
		if (imageSrcUrl) {
			useImage(imageSrcUrl, setImageSrc)
		}
	}, [imageSrcUrl])
	return (
		<div className="w-full border rounded-lg overflow-hidden shadow-lg flex">
			<img
				className="w-4/12 h-full object-cover"
				src={imageSrc ? imageSrc : "https://flowbite-react.com/images/blog/image-4.jpg"}
				alt={title}
			/>
			<div className="py-8 pl-8 pr-12 w-8/12 flex flex-col justify-between">
				<div className="flex flex-col items-start gap-6">
					<div className="flex flex-row justify-between items-center w-full">
						<h5 className="text-2xl font-bold text-gray-900 w-11/12">{title}</h5>
						<Dropdown
							label=""
							placement="bottom"
							dismissOnClick={false}
							renderTrigger={() => (
								<div className="flex flex-col justify-between gap-1 cursor-pointer p-4">
									<div className="w-1 h-1 bg-gray-800 rounded-full"></div>
									<div className="w-1 h-1 bg-gray-800 rounded-full"></div>
									<div className="w-1 h-1 bg-gray-800 rounded-full"></div>
								</div>
							)}
							className="w-1/12"
						>
							<Dropdown.Item onClick={() => onUpdate()}>Editar</Dropdown.Item>
							<Dropdown.Item onClick={() => onDelete()}>Eliminar</Dropdown.Item>
						</Dropdown>
					</div>
					<p className="font-normal text-gray-700">{description}</p>
				</div>

				{other && <p className="mt-2">{other}</p>}
			</div>
		</div>
	)
}

export default Card
