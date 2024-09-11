// Definimos la estructura principal de los datos que maneja el sistema
export interface DataType {
	key: string // Identificador único, puede ser el 'id' del senior
	name: string // Nombre del senior
	email: string // Correo electrónico
	address: string // Dirección física
	birthDate: string // Fecha de nacimiento en formato de string (ISO 8601)
}

// Opciones para los campos editables en un formulario de seniors
export type FieldType = {
	name?: string // Nombre, opcional en algunas operaciones
	email?: string // Correo, opcional en algunas operaciones
	password?: string // Contraseña, opcional
	address?: string // Dirección, opcional
	birthDate?: string // Fecha de nacimiento, opcional
}
