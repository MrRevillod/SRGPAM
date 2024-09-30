import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { AntDesign } from "@expo/vector-icons"

const GoBackButton = (navigation: any) => {
	return (
		<TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
			<AntDesign name="arrowleft" size={24} color="white" />
			<Text style={styles.buttonText}>Volver</Text>
		</TouchableOpacity>
	)
}

export default GoBackButton

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		position: "absolute",
		left: 20,
		top: 20,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		textAlign: "center",
	},
})
