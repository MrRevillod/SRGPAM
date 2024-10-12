import React from "react"
import { Loading } from "./Loading"
import { Pagination } from "antd"
import { usePagination } from "../hooks/usePagination"

interface Props<T> {
	data: T[]
	renderCard: (item: T) => JSX.Element
	loading?: boolean
}

export const CardLayout = <T extends any>({ data, renderCard, loading }: Props<T>) => {
	const { paginatedData, currentPage, pageSize, total, onPageChange } = usePagination({
		data,
		defaultPageSize: 6,
	})

	return (
		<section className="flex flex-col w-full h-full gap-8">
			{loading && <Loading />}
			<div className="grid grid-cols-2 xl:grid-cols-3 gap-8">{paginatedData.map(renderCard)}</div>
			<Pagination
				defaultPageSize={6}
				pageSizeOptions={["6", "12", "24", "48"]}
				current={currentPage}
				pageSize={pageSize}
				total={total}
				onChange={onPageChange}
				size="default"
				align="end"
			/>
		</section>
	)
}
