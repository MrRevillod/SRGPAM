import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { useState } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const Camera = () => {
	const [facing, setFacing] = useState<CameraType>("back")
	const [permission, requestPermission] = useCameraPermissions()

	if (!permission) {
		return <View />
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Necesitamos tu permiso para mostrar la cámara</Text>
				<Button onPress={requestPermission} title="conceder permiso" />
			</View>
		)
	}

	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"))
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} facing={facing}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
						<Text style={styles.text}>Flip Camera</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	)
}

export default Camera

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
})