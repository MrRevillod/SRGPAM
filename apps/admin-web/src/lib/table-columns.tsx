import { DataType } from "./types"

export const columnsConfig: Array<{ title: string; dataIndex: keyof DataType; key: string }> = [
	{ title: "RUT", dataIndex: "id", key: "id" },
	{ title: "Nombre", dataIndex: "name", key: "name" },
	{ title: "Correo Electrónico", dataIndex: "email", key: "email" },
	{ title: "Dirección", dataIndex: "address", key: "address" },
	{ title: "Fecha de Nacimiento", dataIndex: "birthDate", key: "birthDate" },
	{ title: "Verificado", dataIndex: "validated", key: "validated" },
	{ title: "Creado", dataIndex: "createdAt", key: "createdAt" },
	{ title: "Actualizado", dataIndex: "updatedAt", key: "updatedAt" },
]
