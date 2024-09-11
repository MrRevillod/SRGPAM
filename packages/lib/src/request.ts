import { AppError } from "."
import { constants, services } from "./config"
import { JsonResponse, ContentTypeVariant, ServiceName, AllowedHttpMethod } from "./types"

/**
 * httpRequest is a function that sends a request to a service
 * @param service - the service to send the request to
 * @param endpoint - the endpoint to send the request to
 * @param method - the http method to use for the request
 * @param body - the body of the request
 * @param variant - the content type variant of the request
 * @returns a JsonResponse object
 *
 * @throws {Error} - if the service is not found in the services object
 * @throws {Error} - if the method is GET and the body is not undefined
 * @throws {Error} - if the variant is MULTIPART and the body is not an instance of FormData
 * @throws {Error} - if the response is not ok
 * @throws {Error} - if an unknown error occurs
 *
 * @example
 *
 * const response = await httpRequest<User[]>("DASHBOARD", "/provide-users", "GET", "JSON")
 *
 * response.values.forEach((user) => {
 * 	console.log(user)
 * })
 *
 * return res.status(200).json(response)
 */

export const httpRequest = async <T>(
	service: ServiceName,
	endpoint: string,
	method: AllowedHttpMethod,
	variant: ContentTypeVariant,
	body?: any,
): Promise<JsonResponse<T>> => {
	if (!services[service]) {
		throw new Error(`Service ${service} not found in services`)
	}

	if (method === "GET" && body) {
		throw new Error("GET requests cannot have a body")
	}

	if (variant === "MULTIPART" && !(body instanceof FormData)) {
		throw new Error("Body must be of type FormData")
	}

	const url = `${services[service].url}${endpoint}`
	const headers = new Headers()

	if (variant === "JSON") {
		headers.append("Content-Type", "application/json")
    }
    
    if (service === "STORAGE") {
        headers.append("X-storage-key",constants.STORAGE_KEY)
    }

	try {
		const response = await fetch(url, {
			method,
			headers,
			body: variant === "JSON" ? JSON.stringify(body) : body,
		})

		const result = (await response.json()) as JsonResponse<T>

		if (!response.ok) {
			throw new AppError(
				(result as any).status || 500,
				(result as any).message,
				((result as any).values || {}) as Record<string, unknown>,
			)
		}

		return result
	} catch (error: unknown) {
		throw error
	}
}
