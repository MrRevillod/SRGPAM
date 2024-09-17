import React, { ReactNode, useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"

interface PageLayoutProps {
	pageTitle: string
	addFunction?: () => void
	setData?: () => void
	children: ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ pageTitle, addFunction, setData, children }) => {
	return (
		<section className="pt-12 px-20 flex flex-col gap-4 w-full">
			<PageHeader pageTitle={pageTitle} addFunction={addFunction} setData={setData} />
			<section className="w-full">{children}</section>
		</section>
	)
}

export default PageLayout
