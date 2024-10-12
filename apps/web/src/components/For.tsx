import React from "react"

import { Fragment } from "react"

interface ForProps<T> {
	items: T[]
	render: (item: T) => JSX.Element
}

export const For = <T,>({ items, render }: ForProps<T>) => {
	return (
		<>
			{items.map((item, index) => (
				<Fragment key={index}>{render(item)}</Fragment>
			))}
		</>
	)
}
