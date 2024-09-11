import { Control, FieldErrors, FieldValues } from "react-hook-form"

export interface registerFormData {
	username: string
	email: string
	password: string
	dni_a: string
	dni_b: string
	rshPhoto: string
}

export interface commonProps {
	route: any
	navigation: any
	control?: Control<FieldValues>
	errors?: FieldErrors<FieldValues>
	handleSubmit?: any
	setValue?: any
	trigger?: any
	validateAndNavigate?: any
}
