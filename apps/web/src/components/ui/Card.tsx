import { Card } from "flowbite-react"
import React from "react"
import { Show } from "./Show"
import { Dropdown } from "flowbite-react"

interface Props {
	title: string
	description: string
	imageSrc?: string
	other?: string
	onDelete: () => any | Promise<any>
	onUpdate: () => any | Promise<any>
}

const FlowbiteCard: React.FC<Props> = ({ title, description, imageSrc, other, onUpdate, onDelete }) => {
	return (
		<Card
			className="max-w-sm"
			imgSrc={imageSrc ? imageSrc : "https://flowbite-react.com/images/blog/image-4.jpg"}
			horizontal
		>
			<div className="flex justify-between">
				<h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
				<Dropdown label="" className="bg-white " dismissOnClick={false}>
					<Dropdown.Item onClick={() => onUpdate()}>Actualizar</Dropdown.Item>
					<Dropdown.Item onClick={() => onDelete()}>Eliminar</Dropdown.Item>
				</Dropdown>
			</div>
			<p className="font-normal text-gray-700 dark:text-gray-400">{description}</p>
			<Show when={other !== undefined}>
				<p>{other}</p>
			</Show>
		</Card>
	)
}

export default FlowbiteCard
