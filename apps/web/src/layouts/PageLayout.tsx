import React from "react"
import PageHeader from "../components/PageHeader"

import { Dispatch, ReactNode, SetStateAction } from "react"

interface PageLayoutProps {
	pageTitle: string
	addFunction?: () => void
	searchKeys?: string[]
	data?: any[]
	setData?: Dispatch<SetStateAction<any[]>>
	children: ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ pageTitle, addFunction, data, searchKeys, setData, children }) => {
	return (
		<section className="pt-12 px-20 flex flex-col gap-4 w-full">
			<PageHeader
				pageTitle={pageTitle}
				addFunction={addFunction}
				searchKeys={searchKeys}
				data={data}
				setData={setData}
			/>
			<section className="w-full">{children}</section>
		</section>
	)
}

export default PageLayout
