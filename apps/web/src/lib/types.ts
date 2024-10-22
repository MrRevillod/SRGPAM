import { AxiosResponse } from "axios"
import { GetProp, UploadProps } from "antd"
import { Dispatch, SetStateAction } from "react"

export type HexColor = `#${string}`
export type Nullable<T> = T | null

export type BaseDataType = {
	id: string | number
}

export type UserRole = "ADMIN" | "PROFESSIONAL"

export type LoginFormData = {
	email: string
	password: string
	role: UserRole
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
	color: HexColor
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
	refetch?: () => void
}

export type Event = {
	id: string
	startsAt: string
	endsAt: string
	assistance: boolean

	seniorId?: string | null
	professionalId: string
	centerId?: number | null
	serviceId?: number | null

	service: Partial<Service>
	center: Partial<Center>

	createdAt: Date
	updatedAt: Date
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]
export type ApiError = string | string[] | null

export type QueryAction = ({ query }: QueryActionProps) => Promise<AxiosResponse<any, any>>
export type MutateAction = ({ id, body }: MutateActionProps) => Promise<AxiosResponse<any, any>>

export interface QueryActionProps {
	query?: string
}

export interface MutateActionProps {
	id?: string | number
	body?: any
}

export type MutationResponse<T> = {
	modified: T
	image?: string
}

export type SuperSelectField = {
	label: string
	value: string
}
