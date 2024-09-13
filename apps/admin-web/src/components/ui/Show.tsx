import React from "react"

interface Props {
	when: boolean
	children: React.ReactNode
}

export const Show: React.FC<Props> = ({ when, children }) => {
	return when ? children : null
}
