import { Dispatch, SetStateAction } from "react"
import { UserRole } from "./types"
import { Location } from "react-router-dom"

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

export const formatRole = (role: UserRole) => {
	return role === "ADMIN" ? "Administrador" : "Profesional"
}

interface SelectDataFormatterProps {
	data: any[]
	setData: Dispatch<SetStateAction<any[]>>
	keys?: { label: string; value: string }
}

const defaultSelectKeys = { label: "name", value: "id" }

export const selectDataFormatter = ({ data, setData, keys = defaultSelectKeys }: SelectDataFormatterProps) => {
	setData(data.map((item) => ({ label: item[keys.label], value: item[keys.value] })))
}

export const getIdFromUrl = (location: Location<any>): string | undefined => {
	const url = new URLSearchParams(location.search).toString()
	return url.split("=")[1]
}
