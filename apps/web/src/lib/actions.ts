import { api } from "./axios"
import { getContentType } from "./form"
import { ActionProps } from "./types"

// Acciones CRUD para los administradores

export const getAdministrators = async () => {
	return await api.get("/dashboard/administrators")
}

export const createAdministrator = async ({ body }: ActionProps) => {
	return await api.post("/dashboard/administrators", body)
}

export const updateAdministrator = async ({ id, body }: ActionProps) => {
	if (!id) throw new Error("ID is required for update")
	return await api.patch(`/dashboard/administrators/${id}`, body, {
		headers: {
			"Content-Type": getContentType(body),
		},
	})
}

export const deleteAdministrator = async ({ id }: ActionProps) => {
	return await api.delete(`/dashboard/administrators/${id}`)
}

// Acciones CRUD para los centros

export const getCenters = async () => {
	return await api.get("/dashboard/centers")
}

export const createCenter = async ({ body }: ActionProps) => {
	return await api.post("/dashboard/centers", body, {
		headers: {
			"Content-Type": getContentType(body),
		},
	})
}

export const updateCenter = async ({ id, body }: ActionProps) => {
	if (!id) throw new Error("ID is required for update")

	return await api.patch(`/dashboard/centers/${id}`, body, {
		headers: {
			"Content-Type": getContentType(body),
		},
	})
}

export const deleteCenter = async ({ id }: ActionProps) => {
	return await api.delete(`/dashboard/centers/${id}`)
}
