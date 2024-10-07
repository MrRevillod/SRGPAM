import { LoginVariant } from "./types"

export const formatRut = (rut: string) => {
	return rut.replace(/(\d{1,3})(\d{3})(\d{3})(\w{1})/, "$1.$2.$3-$4")
}

export const formatBoolean = (value: boolean) => {
	return value ? "Sí" : "No"
}

export const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString()
}

export const dateToAge = (dateString: string) => {
	const date = new Date(dateString)
	const ageDifMs = Date.now() - date.getTime()
	const ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export const tableColumnsFormatters = {
	id: formatRut,
	birthDate: dateToAge,
	updatedAt: formatDate,
	createdAt: formatDate,
	validated: formatBoolean,
}

export const formatRole = (role: LoginVariant) => {
	return role === "ADMIN" ? "Administrador" : "Profesional"
}
