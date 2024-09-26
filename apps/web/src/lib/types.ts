// Definimos la estructura principal de los datos que maneja el sistema
export interface DataType {
	id: string // Identificador único, puede ser el 'id' del senior
	name: string // Nombre del senior
	email: string // Correo electrónico
	address: string // Dirección del senior
	birthDate: string // Fecha de nacimiento en formato de string (ISO 8601)
	validated: boolean // Indica si el senior ha sido validado
	createdAt: string // Fecha de creación en formato de string (ISO 8601)
	updatedAt: string // Fecha de actualización en formato de string (ISO 8601)
}

// Opciones para los campos editables en un formulario de seniors
export type FieldType = {
	id?: string
	name?: string // Nombre, opcional en algunas operaciones
	email?: string // Correo, opcional en algunas operaciones
	password?: string // Contraseña, opcional
	address?: string // Dirección, opcional
	birthDate?: string // Fecha de nacimiento, opcional
}

export interface newSenior {
	id: string
	name: string
	email: string
	birthDate: string
	address: string
	validated: boolean
}

export type BaseDataType = {
	id: string
}

export type LoginVariant = "ADMIN" | "PROFESSIONAL"

export type LoginFormData = {
	email: string
	password: string
	role: LoginVariant
	rememberMe: boolean
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
