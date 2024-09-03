import React from "react"
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform } from "react-native"
import Colors from "@/components/colors"
import CustomButton from "@/components/register/button"
const { width, height } = Dimensions.get("window")

type GeneralViewProps = {
	title: string
	children: React.ReactNode
	textCircle: string
	textTitle: string
	textDescription?: string
}

const GeneralView = ({ title, children, textCircle, textTitle, textDescription }: GeneralViewProps) => {
	return (
		<KeyboardAvoidingView style={styles.greenContainer} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled={Platform.OS === "ios"}>
			<Text style={styles.title}>{title} </Text>
			<View style={styles.whiteContainer}>
				<View style={styles.description}>
					<View style={styles.circle}>
						<Text style={styles.circleText}>{textCircle}</Text>
					</View>
					<Text style={{ fontSize: 18, fontWeight: "500", flex: 1, alignSelf: "center" }}>{textTitle}</Text>
				</View>
				{textDescription && (
					<Text style={{ fontSize: 16, alignSelf: "center", marginTop: 10, color: Colors.gray, textAlign: "justify" }}>
						{textDescription}
					</Text>
				)}
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
		height: "auto",
		margin: 0,
	},
	circle: {
		width: width * 0.15,
		height: width * 0.15,
		borderRadius: width * 0.1,
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
