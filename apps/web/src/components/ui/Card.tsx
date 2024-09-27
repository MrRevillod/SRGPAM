import { Card } from "flowbite-react"
import React from "react"
import { Show } from "./Show"

interface Props {
	title: string
	description: string
	imageSrc?: string
	other?: string
}

const FlowbiteCard: React.FC<Props> = ({ title, description, imageSrc, other }) => {
	return (
		<Card
			className="max-w-sm"
			imgSrc={imageSrc ? imageSrc : "https://flowbite-react.com/images/blog/image-4.jpg"}
			horizontal
		>
			<h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
			<p className="font-normal text-gray-700 dark:text-gray-400">{description}</p>
			<Show when={other !== undefined}>
				<p>{other}</p>
			</Show>
		</Card>
	)
}

export default FlowbiteCard
