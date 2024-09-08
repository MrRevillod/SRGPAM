import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { commonProps } from "@/components/register/types"

const Final = ({ navigation }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="7/7"
			textTitle="Todo Listo!"
			textDescription="Has completado el registro. Cuando la municipalidad valide tus datos seras notificado y podras solicitar horas"
		>
			<CustomButton
				style={{ backgroundColor: Colors.white }}
				textStyle={styles.customButtonText}
				title="Volver"
				onPress={() => navigation.goBack()}
			/>
		</GeneralView>
	)
}

export default Final

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	customButtonText: {
		color: Colors.green,
	},
})
