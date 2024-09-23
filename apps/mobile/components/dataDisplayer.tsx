import React from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageSourcePropType } from "react-native"
import Colors from "@/components/colors"
const { width } = Dimensions.get("window")

type DataDisplayerProps = {
	imgPath?: ImageSourcePropType
	titleField: string | number
	descriptionField?: String | number
	actionButton?: "Ingresar" | "Cambiar"
}

const DataDisplayer = ({ imgPath, titleField, descriptionField, actionButton }: DataDisplayerProps) => {
	return (
		<View style={styles.dataContainer}>
			<View style={{ flexDirection: "row", alignItems: "center", padding: width * 0.01 }}>
				<Image source={imgPath} style={{ width: width * 0.11, height: width * 0.11 }} />
				{!descriptionField && !actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: "auto" }}>
						<Text style={styles.textTitle}>{titleField}</Text>
					</View>
				)}
				{!descriptionField && actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: width * 0.6 }}>
						<Text style={styles.textTitle}>{titleField}</Text>
					</View>
				)}
				{descriptionField && !actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: "auto" }}>
						<Text style={styles.textTitle}>{titleField}</Text>
						<Text style={{ fontSize: 16, color: Colors.gray, margin: 0, padding: 0, fontWeight: "bold" }}>{descriptionField}</Text>
					</View>
				)}
				{descriptionField && actionButton && (
					<View style={{ flexDirection: "column", marginLeft: 10, maxWidth: width * 0.6 }}>
						<Text style={styles.textTitle}>{titleField}</Text>
						<Text style={{ fontSize: 16, color: Colors.gray, margin: 0, padding: 0, fontWeight: "bold" }}>{descriptionField}</Text>
					</View>
				)}
			</View>
			{actionButton && (
				<TouchableOpacity>
					<Text style={{ fontSize: 16, color: Colors.green, textDecorationLine: "underline", marginHorizontal: width * 0.05 }}>
						{actionButton}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

export default DataDisplayer

const styles = StyleSheet.create({
	dataContainer: {
		borderBottomWidth: 1,
		borderColor: Colors.gray,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 5,
		borderRadius: 5,
	},
	textTitle: {
		fontSize: 16,
		color: Colors.black,
		margin: 0,
		padding: 0,
		fontWeight: "400",
	},
})
