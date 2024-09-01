import React from "react"
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform } from "react-native"
import Colors from "@/components/colors"
const { width, height } = Dimensions.get("window")

type GeneralViewProps = {
	title: string
	children: React.ReactNode
}

const GeneralView = ({ title, children }: GeneralViewProps) => {
	return (
		<KeyboardAvoidingView style={styles.greenContainer} behavior={Platform.OS === "ios" ? "padding" : undefined} enabled={Platform.OS === "ios"}>
			<Text style={styles.title}>{title} </Text>
			<View style={styles.whiteContainer}>
				<View style={styles.description}>
					<View style={styles.circle}>
						<Text style={styles.circleText}>1/6</Text>
					</View>
					<Text style={{ fontSize: 20, alignSelf: "center", fontWeight: "500" }}>Ingresa Tu Rut</Text>
				</View>
				{children}
			</View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	greenContainer: {
		flex: 1,
		backgroundColor: Colors.green,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		position: "absolute",
		top: height * 0.0825,
		fontWeight: "700",
		fontSize: 24,
		color: "#FFFFFF",
		textAlign: "center",
		textShadowColor: "rgba(0, 0, 0, 0.25)",
		textShadowOffset: { width: 0, height: 5 * (height / 800) },
		textShadowRadius: 4 * (width / 360),
	},
	whiteContainer: {
		position: "absolute",
		top: height * 0.2,
		width: "100%",
		height: "80%",
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: "10%",
	},
	description: {
		flexDirection: "row",
		height: "10%",
	},
	circle: {
		width: width * 0.15, // 10% of screen width for diameter
		height: width * 0.15, // 10% of screen width for diameter
		borderRadius: width * 0.1, // 5% of screen width for radius
		justifyContent: "center",
		alignItems: "center",
		borderColor: Colors.green,
		borderWidth: 3,
		marginRight: 10,
	},
	circleText: {
		color: Colors.green,
		fontWeight: "bold",
		fontSize: 16,
	},
})

export default GeneralView
