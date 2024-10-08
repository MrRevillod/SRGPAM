import React from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native"
import Colors from "@/components/colors"
const { width } = Dimensions.get("window")

type MenuBarProps = {
	onPress: () => void
}

const MenuBar = ({ onPress }: MenuBarProps) => {
	return (
		<View style={styles.menuContainer}>
			<TouchableOpacity style={styles.menuCircle} onPress={onPress}>
				<Image
					source={require("@/assets/images/menu/home.png")}
					style={{
						width: width * 0.097,
						height: width * 0.097,
						alignSelf: "center",
					}}
				/>
				<Text style={{ fontSize: 16, padding: 0, margin: 0, color: Colors.green }}>Inicio</Text>
			</TouchableOpacity>
			<View style={{ width: "100%", height: "23%", padding: 0, margin: 0 }}></View>
			<View style={{ backgroundColor: Colors.green, width: "100%", height: "77%", padding: 0, margin: 0, justifyContent: "center" }}>
				<View
					style={{
						marginHorizontal: width * 0.125,
						width: "auto",
						justifyContent: "space-between",
						flexDirection: "row",
					}}
				>
					<TouchableOpacity
						style={{
							width: width * 0.18,
							height: width * 0.14,
							alignContent: "center",
							alignItems: "center",
						}}
					>
						<Image source={require("@/assets/images/menu/settings.png")} style={{ width: width * 0.08, height: width * 0.08 }} />
						<Text style={{ fontSize: 16, padding: 0, margin: 0, color: Colors.white }}>Ajustes</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							width: width * 0.18,
							height: width * 0.14,
							alignContent: "center",
							alignItems: "center",
						}}
					>
						<Image source={require("@/assets/images/menu/calendar.png")} style={{ width: width * 0.08, height: width * 0.08 }} />
						<Text style={{ fontSize: 16, padding: 0, margin: 0, color: Colors.white }}>Agenda</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default MenuBar

const styles = StyleSheet.create({
	menuContainer: {
		width: "100%",
		height: "11%",
		position: "absolute",
		bottom: 0,
	},
	menuCircle: {
		width: width * 0.21,
		height: width * 0.21,
		borderRadius: width * 1,
		borderColor: Colors.green,
		borderWidth: 5,
		backgroundColor: Colors.white,
		zIndex: 1,
		alignSelf: "center",
		position: "absolute",
		top: 0,
		justifyContent: "center",
		alignItems: "center",
	},
})
