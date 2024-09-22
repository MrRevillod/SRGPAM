import { Control, FieldErrors, FieldValues } from "react-hook-form"

export type commonProps = {
	route: any
	navigation: any
	control?: Control<FieldValues>
	errors?: FieldErrors<FieldValues>
	handleSubmit?: any
	setValue?: any
	trigger?: any
	validateAndNavigate?: any
	rutSenior?: string | null
}
