import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry"
import { getAccessToken, getRefreshToken } from "./storage"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { SERVER_URL } from "@/constants/colors"
import { Alert } from "react-native"
import { AuthResponse } from "./types"

export const makeAuthenticatedRequest = async (
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	showAlert: boolean,
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

		const response = await axios<AuthResponse>({
			url: url,
			method,
			...options,
			headers,
		})

		return response
	} catch (error: any) {
		if (showAlert && error.response.data.message) {
			Alert.alert("Error", error.response.data.message)
		}
		console.error(error.response.data.message)
		return null
	}
}

export const checkUniqueField = async (field: string, getValues: any, trigger: any, setError: any): Promise<boolean | undefined> => {
	try {
		const fieldValue = getValues(field)
		const isValid = await trigger(field)
		if (isValid) {
			const response = await axios.post(`${SERVER_URL}/api/dashboard/seniors/check-unique`, { [field]: fieldValue })
			if (response.status === 200) {
				return true
			}
		}
	} catch (error: any) {
		if (error.response && error.response.status === 409) {
			const values = error.response.data.values
			if (field === "rut") {
				setError(field, {
					type: "manual",
					message: values.rut,
				})
			}
			if (field === "email") {
				setError(field, {
					type: "manual",
					message: values.email,
				})
			}
			return false
		}
	}
}
