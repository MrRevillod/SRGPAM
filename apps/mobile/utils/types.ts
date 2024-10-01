import { Control, FieldValues } from "react-hook-form"

export type commonProps = {
	route: any
	navigation: any
	control?: Control<FieldValues>
	errors?: any
	handleSubmit?: any
	setValue?: any
	getValues?: any
	trigger?: any
	setError?: any
	validateAndNavigate?: any
	rutSenior?: string | null
}
