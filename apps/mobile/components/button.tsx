import React from "react"
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Dimensions } from "react-native"
import Colors from "@/components/colors"

const { height } = Dimensions.get("window")

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
		marginVertical: 5,
		justifyContent: "center",
		width: "auto",
		height: height * 0.05,
		backgroundColor: Colors.green,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		textAlign: "center",
	},
})

export default CustomButton
