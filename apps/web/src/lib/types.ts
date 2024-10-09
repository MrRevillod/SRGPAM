import { GetProp, UploadProps } from "antd"
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
export interface Professional extends IUser {
	service: Partial<Service>
}

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

export type TableColumnType<T> = Array<{
	title: string
	dataIndex: keyof T | string[]
	key: string
}>

export type FormProps<T> = {
	data: T[]
	setData: Dispatch<SetStateAction<T[]>>
}

export type Event = {
	id: string // Equivalente de Int en Prisma
	startsAt: string // DateTime en Prisma es Date en TypeScript
	endsAt: string
	assistance: boolean // Boolean en Prisma es boolean en TS

	createdAt: Date
	updatedAt: Date

	seniorId?: string | null // Campos opcionales en Prisma se traducen a `| null` o con `?`
	professionalId: string
	centerId?: number | null
	serviceId?: number | null
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]
