import React from "react"
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform, Image } from "react-native"
import Colors from "@/components/colors"
import GoBackButton from "@/components/goBack"
const { width, height } = Dimensions.get("window")

type GeneralViewProps = {
	title: string
	children: React.ReactNode
	textCircle?: string
	textTitle?: string
	textDescription?: string
}

const GeneralView = ({ title, children, textCircle, textTitle, textDescription }: GeneralViewProps) => {
	return (
		<KeyboardAvoidingView
			style={{ backgroundColor: Colors.green, flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			enabled={true}
		>
			<View style={styles.greenContainer}>
				<GoBackButton></GoBackButton>
				<Text style={styles.title}>{title} </Text>
			</View>
			<View style={styles.whiteContainer}>
				<View style={styles.description}>
					{textCircle && textTitle && (
						<>
							<View style={styles.circle}>
								<Text style={styles.circleText}>{textCircle}</Text>
							</View>
							<Text style={{ fontSize: 18, fontWeight: "500", flex: 1, alignSelf: "center" }}>{textTitle}</Text>
						</>
					)}
					{!textCircle && textTitle && <Text style={{ fontSize: 20, fontWeight: "500", flex: 1, textAlign: "center" }}>{textTitle}</Text>}
				</View>
				{textDescription && <Text style={{ fontSize: 16, marginTop: 10, color: Colors.gray, textAlign: "justify" }}>{textDescription}</Text>}
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
		height: "20%",
	},
	title: {
		alignSelf: "center",
		fontWeight: "700",
		fontSize: 24,
		color: "#FFFFFF",
		textAlign: "center",
		textShadowColor: "rgba(0, 0, 0, 0.25)",
		textShadowOffset: { width: 0, height: 5 * (height / 800) },
		textShadowRadius: 4 * (width / 360),
	},
	whiteContainer: {
		width: "100%",
		height: "80%",
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
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
