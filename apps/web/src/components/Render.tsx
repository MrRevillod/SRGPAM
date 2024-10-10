import React from "react"

import { Fragment } from "react"

interface RenderProps<T> {
	items: T[]
	render: (item: T) => JSX.Element
}

export const Render = <T,>({ items, render }: RenderProps<T>) => {
	return (
		<>
			{items.map((item, index) => (
				<Fragment key={index}>{render(item)}</Fragment>
			))}
		</>
	)
}
