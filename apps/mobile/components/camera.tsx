import { CameraView, useCameraPermissions } from "expo-camera"
import { useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { useRoute } from "@react-navigation/native"

const Camera = ({ navigation }: any) => {
	const [permission, requestPermission] = useCameraPermissions()
	const cameraRef = useRef<CameraView | null>(null)
	const route = useRoute()
	if (!permission) {
		return <View />
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Necesitamos tu permiso para mostrar la cámara</Text>
				<Button onPress={requestPermission} title="Conceder permiso" />
			</View>
		)
	}

	const takePhoto = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePictureAsync({ quality: 0.01 })
			if (photo) {
				const { params } = route as any
				if (params?.from === "DNI") {
					navigation.navigate("DNI", { photoUri: photo.uri })
				} else if (params?.from === "Social") {
					navigation.navigate("Social", { photoUri: photo.uri })
				}
			}
		}
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} ref={cameraRef}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={takePhoto}>
						<AntDesign name="camera" size={44} color="white" />
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
		justifyContent: "flex-end",
		alignItems: "center",
		marginBottom: 30,
	},
	button: {
		padding: 15,
		backgroundColor: "green",
		borderRadius: 5,
	},
	text: {
		fontSize: 18,
		color: "white",
	},
})
