import { Dispatch, SetStateAction } from "react"

export type BaseDataType = {
	id: string
}

export type LoginVariant = "ADMIN" | "PROFESSIONAL"

export type LoginFormData = {
	email: string
	password: string
	role: LoginVariant
}

interface IUser {
	id: string
	email: string
	name: string
	createdAt: string
	updatedAt: string
}

export interface Administrator extends IUser {}
export interface Professional extends IUser {}

export type Service = {
	id: number
	name: string
	title: string
	description: string
}

export type Center = {
	id: number
	name: string
	address: string
	phone: string
}

export interface Senior extends IUser {
	address: string
	birthDate: string
	validated: boolean
}

export type UnvalidatedSenior = Omit<Senior, "name" & "address" & "birthDate">
export type User = Administrator | Professional | Senior

export type ApiResponse = {
	status?: number
	message: string
	type: "success" | "error"
	values: any
}

export type PasswordFields = {
	password: string
	confirmPassword: string
}

export type TableColumnType<T> = Array<{ title: string; dataIndex: keyof T; key: string }>

export type CreateEntityFormProps<T> = {
	visible: boolean
	onCancel: () => void
	onOk: () => void
	data: T[]
	setData: Dispatch<SetStateAction<T[]>>
}

export type UpdateEntityFormProps<T> = {
	visible: boolean
	entity: T | null
	onCancel: () => void
	onOk: () => void
	data: T[]
	setData: Dispatch<SetStateAction<T[]>>
}
