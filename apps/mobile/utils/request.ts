import { getAccessToken, getRefreshToken } from "./storage"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export const makeAuthenticatedRequest = async (
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	options: AxiosRequestConfig = {},
): Promise<AxiosResponse | null> => {
	try {
		const accessToken = await getAccessToken()
		const refreshToken = await getRefreshToken()

		if (!accessToken || !refreshToken) {
			throw new Error("Tokens no disponibles, el usuario necesita autenticarse de nuevo")
		}

		const headers = {
			...options.headers,
			Authorization: `Bearer ${accessToken}, Bearer ${refreshToken}`,
		}

		const response = await axios({
			url: url,
			method,
			...options,
			headers,
		})

		return response
	} catch (error) {
		console.error("Error en la solicitud autenticada", error)
		return null
	}
}
