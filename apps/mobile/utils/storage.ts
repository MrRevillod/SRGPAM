import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export const storeTokens = async (accessToken: string, refreshToken: string) => {
	try {
		await AsyncStorage.setItem("accessToken", accessToken)
		await AsyncStorage.setItem("refreshToken", refreshToken)
	} catch (error) {
		console.error("No se pudieron almacenar los tokens", error)
	}
}

export const getAccessToken = async (): Promise<string | null> => {
	try {
		const token = await AsyncStorage.getItem("accessToken")
		return token || null
	} catch (error) {
		console.error("Error al obtener el access token", error)
		return null
	}
}

export const makeAuthenticatedRequest = async (url: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse | null> => {
	try {
		const token = await getAccessToken()

		if (!token) {
			throw new Error("Token no disponible, el usuario necesita autenticarse de nuevo")
		}

		const headers = {
			...options.headers,
			Authorization: `Bearer ${token}`,
		}

		const response = await axios({
			url: url,
			...options,
			headers: headers,
		})

		return response
	} catch (error) {
		console.error("Error en la solicitud autenticada", error)
		return null
	}
}

export const storeUser = async (user: any) => {
	try {
		await AsyncStorage.setItem("user", JSON.stringify(user))
	} catch (error) {
		console.error("No se pudo almacenar el usuario", error)
	}
}
