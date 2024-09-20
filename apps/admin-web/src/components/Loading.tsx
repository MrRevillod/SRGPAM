import React from "react"

import { Spinner } from "flowbite-react"

const Loading: React.FC = () => {
	return (
		<div className="flex justify-center items-center h-screen absolute z-50 bg-red-600">
			<Spinner size="large" />
		</div>
	)
}

export default Loading
