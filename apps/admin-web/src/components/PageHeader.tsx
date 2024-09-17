import { Show } from "./ui/Show"
import { Breadcrumb } from "flowbite-react"
import { useNavigate } from "react-router-dom"
import { HiHome, HiUserAdd } from "react-icons/hi"
import React, { useEffect, useState } from "react"

interface PageHeaderProps {
	pageTitle: string
	addFunction?: () => void
	setData?: () => void
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle, addFunction, setData }) => {
	const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const pagePath = window.location.pathname
		setBreadcrumbItems(pagePath.split("/").filter((item) => item !== ""))

		console.log("breadcrumbItems", breadcrumbItems)
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

	return (
		<section className="flex flex-col gap-4 w-full">
			<div className="flex flex-row w-full">
				<div className="flex flex-col gap-4 w-4/6">
					<h1 className="text-2xl font-bold">{pageTitle}</h1>
					<Breadcrumb aria-label="Default breadcrumb example" className="text-neutral-500">
						<Breadcrumb.Item href="/" icon={HiHome} />
						{breadcrumbItems.map((item, index) => (
							<Breadcrumb.Item key={index} href="#" onClick={() => navigateTo(item)}>
								{capitalize(item)}
							</Breadcrumb.Item>
						))}
					</Breadcrumb>
				</div>

				<Show when={addFunction !== undefined && setData !== undefined}>
					<div className="flex flex-row gap-4 w-2/6 items-center justify-center">
						<input
							className="w-3/4 h-10 rounded-lg border border-neutral-300 px-4"
							type="text"
							placeholder="Buscar..."
							onChange={setData}
						/>
						<button
							className="bg-green-600 text-neutral-50 font-semibold w-1/4 h-10 rounded-lg flex items-center justify-center gap-2"
							onClick={() => addFunction && addFunction()}
						>
							Nuevo
							<HiUserAdd className="text-neutral-50 text-lg" />
						</button>
					</div>
				</Show>
			</div>

			<hr className="my-1" />
		</section>
	)
}

export default PageHeader
