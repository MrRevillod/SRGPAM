import React from "react"
import PageHeader from "../components/PageHeader"

import { Dispatch, ReactNode, SetStateAction } from "react"

interface PageLayoutProps {
	pageTitle: string
	create?: boolean
	searchKeys?: string[]
	data?: any[]
	setData?: Dispatch<SetStateAction<any[]>>
	children: ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ pageTitle, create, data, searchKeys, setData, children }) => {
	return (
		<section className="pt-12 px-20 flex flex-col gap-4 w-full">
			<PageHeader pageTitle={pageTitle} create={create} searchKeys={searchKeys} data={data} setData={setData} />
			<section className="w-full">{children}</section>
		</section>
	)
}

export default PageLayout
