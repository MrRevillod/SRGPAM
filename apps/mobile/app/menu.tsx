import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { commonProps } from "@/components/register/types"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"

const Menu = ({ navigation }: commonProps) => {
	return (
		<GeneralView textCircle="1" textTitle="Eliga una opción" title="Bienvenido">
			<CustomButton title="Ir a Registro" onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }} />
			<CustomButton title="Ir a Login" onPress={() => navigation.navigate("Login")} style={{ marginTop: 20 }} />
		</GeneralView>
	)
}

export default Menu
