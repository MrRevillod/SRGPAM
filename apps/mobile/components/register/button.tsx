import React from "react"
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"
import Colors from "@/components/colors"

type CustomButtonProps = {
	title: string
	onPress: () => void
	style?: ViewStyle
	textStyle?: TextStyle
}

const CustomButton = ({ title, onPress, style, textStyle }: CustomButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, style]}>
			<Text style={[styles.buttonText, textStyle]}>{title}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		width: "auto",
		backgroundColor: Colors.green,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		textAlign: "center",
	},
})

export default CustomButton
