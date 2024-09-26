import { Administrator, Professional, Senior, TableColumnType, UnvalidatedSenior } from "./types"

export const UnvalidatedSeniorsColumns: TableColumnType<UnvalidatedSenior> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Verificado", dataIndex: "validated", key: "validated" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
]

export const SeniorsColumns: TableColumnType<Partial<Senior>> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Nombre", dataIndex: "name", key: "name" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Dirección", dataIndex: "address", key: "address" },
	{ title: "Fecha de Nacimiento", dataIndex: "birthDate", key: "birthDate" },
	{ title: "Verificado", dataIndex: "validated", key: "validated" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
]

export const AdministratorColumns: TableColumnType<Partial<Administrator>> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Nombre", dataIndex: "name", key: "name" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
	{ title: "Actualizado", dataIndex: "updatedAt", key: "updatedAt" },
]

export const ProfessionalColumns: TableColumnType<Partial<Professional>> = AdministratorColumns
