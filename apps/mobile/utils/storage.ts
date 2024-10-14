import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"

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

export const getRefreshToken = async (): Promise<string | null> => {
	try {
		const token = await AsyncStorage.getItem("refreshToken")
		return token || null
	} catch (error) {
		console.error("Error al obtener el refresh token", error)
		return null
	}
}

export const storeUser = async (user: object) => {
	try {
		if (!user) {
			throw new Error("El usuario no existe")
		}
		await AsyncStorage.setItem("user", JSON.stringify(user))
	} catch (error) {
		console.error("No se pudo almacenar el usuario", error)
	}
}

export const getStorageRUT = async (): Promise<string | null> => {
	try {
		const user = await AsyncStorage.getItem("user")
		if (user) {
			const parsedUser = JSON.parse(user)
			return parsedUser?.id ?? null
		}
		return null
	} catch (error) {
		console.error("Error al obtener el ID del usuario", error)
		return null
	}
}
