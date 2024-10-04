import React, { useState, Dispatch, SetStateAction } from "react"

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

	return (
		<input
			className="w-3/4 h-10 rounded-lg border border-neutral-300 px-4"
			type="text"
			placeholder="Buscar..."
			value={value}
			onChange={(e) => handleSearch(e.target.value)}
		/>
	)
}

export default SearchBar
