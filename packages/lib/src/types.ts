export type ContentTypeVariant = "JSON" | "MULTIPART"
export type AllowedHttpMethod = "POST" | "PUT" | "DELETE" | "GET" | "PATCH"
export type ServiceName = "AUTH" | "DASHBOARD" | "STORAGE" | "ADMIN_WEB" | "PRO_WEB"

export type ServiceInfo = {
	url: string
	port: number
}

export type JsonResponse<T> = {
	status?: number
	message: string
	type: "success" | "error"
	values: T
}
