import clsx from "clsx"
import React from "react"

import { useState, Dispatch, SetStateAction } from "react"

interface Props {
	data: any[]
	keys: string[]
	setData: Dispatch<SetStateAction<any[]>>
}

const SearchBar: React.FC<Props> = ({ data, setData, keys }) => {
	const [value, setValue] = useState<string>("")

	const handleSearch = (searchTerm: string) => {
		setValue(searchTerm)

		const filteredData = data.filter((item) => {
			return keys.some((key) => {
				return item[key].toLowerCase().includes(searchTerm.toLowerCase())
			})
		})

		setData(filteredData)
	}

	const classes = clsx(
		"border-neutral-300",
		"rounded-lg px-4 w-3/4 h-10 placeholder-grey",
		"text-dark dark:text-light border-1 bg-light dark:bg-primary-dark",
	)

	return (
		<input
			className={classes}
			type="text"
			placeholder="Buscar..."
			value={value}
			onChange={(e) => handleSearch(e.target.value)}
		/>
	)
}

export default SearchBar
