import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { commonProps } from "@/components/register/types"

const Menu = ({ navigation }: commonProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bienvenido</Text>
			<View style={styles.buttonContainer}>
				<Button title="Ir a Registro" onPress={() => navigation.navigate("Register")} />
			</View>
			<View style={styles.buttonContainer}>
				<Button title="Ir a Login" onPress={() => navigation.navigate("Login")} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
	},
	buttonContainer: {
		marginVertical: 10,
		width: "80%",
	},
})

export default Menu
