import GeneralView from "@/components/generalView"
import { parse } from "@babel/core"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { useState, useEffect } from "react"
import { View, Text, ActivityIndicator } from "react-native"

const Profile = (navigation: any) => {
	const [user, setUser] = useState<any>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getUser = async () => {
			try {
				const user = await AsyncStorage.getItem("user")
				if (!user) {
					throw new Error("El usuario no existe")
				}
				const parsedUser = JSON.parse(user)
				setUser(parsedUser)
				setLoading(false)
			} catch (error) {
				console.error("Error al obtener el usuario", error)
			}
		}
		getUser()
	}, [])

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		)
	}

	const { id, name, email, address, birthDate, validated, createdAt, updatedAt } = user

	return (
		<GeneralView title="Mi Perfil" textTitle="Información personal">
			<View>
				<Text>{id}</Text>
				<Text>{name}</Text>
				<Text>{email}</Text>
				<Text>{address}</Text>
				<Text>{birthDate}</Text>
				<Text>{validated}</Text>
				<Text>{createdAt}</Text>
				<Text>{updatedAt}</Text>
			</View>
		</GeneralView>
	)
}
export default Profile
