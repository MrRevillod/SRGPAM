import React from "react"
import SearchBar from "./SearchBar"

import { Show } from "./ui/Show"
import { useModal } from "../context/ModalContext"
import { Breadcrumb } from "flowbite-react"
import { useNavigate } from "react-router-dom"
import { AiOutlinePlus, AiFillHome } from "react-icons/ai"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface PageHeaderProps {
	pageTitle: string
	create?: boolean
	searchKeys?: string[]
	data?: any[] | null
	setData?: Dispatch<SetStateAction<any[]>>
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle, create, searchKeys, data, setData }) => {
	const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const pagePath = window.location.pathname
		setBreadcrumbItems(pagePath.split("/").filter((item) => item !== ""))
	}, [])

	const navigateTo = (itemIndex: string) => {
		const path = breadcrumbItems.slice(0, breadcrumbItems.indexOf(itemIndex) + 1).join("/")
		navigate(`/${path}`)
	}

	const capitalize = (s: string) => {
		return s
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	const { showModal } = useModal()

	return (
		<section className="flex flex-col gap-4 w-full mb-4">
			<div className="flex flex-row w-full">
				<div className="flex flex-col gap-4 w-4/6">
					<h1 className="text-2xl font-bold text-dark dark:text-light">{pageTitle}</h1>
					<Breadcrumb aria-label="Default breadcrumb example" className="text-neutral-500">
						<Breadcrumb.Item href="/" icon={AiFillHome} />
						{breadcrumbItems.map((item, index) => (
							<Breadcrumb.Item key={index} href="#" onClick={() => navigateTo(item)}>
								{capitalize(item)}
							</Breadcrumb.Item>
						))}
					</Breadcrumb>
				</div>

				<div className="flex flex-row gap-4 w-2/6 items-center justify-center">
					{data && setData && searchKeys && <SearchBar data={data} setData={setData} keys={searchKeys} />}

					<Show when={create != undefined}>
						<button
							className="bg-primary text-light font-semibold w-1/4 h-10 rounded-lg flex items-center justify-center gap-2"
							onClick={() => create && showModal("Create", null)}
						>
							Nuevo
							<AiOutlinePlus className="text-light text-lg" />
						</button>
					</Show>
				</div>
			</div>

			{/* <hr className="my-1 border-neutral-700 dark:border-gray-medium" /> */}
		</section>
	)
}

export default PageHeader
