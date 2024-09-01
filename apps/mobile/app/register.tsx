import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dimensions, StyleSheet, View } from "react-native"
import Colors from "@/components/colors"
import Input from "@/components/register/input"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/register/button"

const registerSchema = z.object({
	rut: z.string().min(1, "RUT es requerido"),
	pin: z.string().min(1, "PIN es requerido"),
	pinConfirm: z.string().min(1, "Confirmación de PIN es requerida"),
})

const Stack = createNativeStackNavigator()

const RUT = ({ navigation, control, errors }: { navigation: any; control: any; errors: any }) => {
	return (
		<GeneralView title="Datos del Registro">
			<View style={styles.container}>
				<View>
					<Input name="rut" placeholder="Ingresa tu RUT" control={control} errors={errors} />
				</View>
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("Pin")} />
			</View>
		</GeneralView>
	)
}

const Pin = ({ navigation, control, errors }: { navigation: any; control: any; errors: any }) => {
	return (
		<GeneralView title="Datos del Registro">
			<View style={styles.container}>
				<View>
					<Input name="pin" placeholder="Ingresa tu pin" control={control} errors={errors} />
				</View>
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("ConfirmPin")} />
				<CustomButton
					style={{ backgroundColor: Colors.white }}
					textStyle={styles.customButtonText}
					title="Volver"
					onPress={() => navigation.goBack()}
				/>
			</View>
		</GeneralView>
	)
}

const ConfirmPin = ({ navigation, control, errors, handleSubmit }: { navigation: any; control: any; errors: any; handleSubmit: any }) => {
	const onSubmit = (data: any) => {
		console.log(data)
	}

	return (
		<GeneralView title="Datos del Registro">
			<View>
				<View>
					<Input name="pinConfirm" placeholder="Confirma tu PIN" control={control} errors={errors} secureTextEntry={true} />
				</View>
				<CustomButton title="Confirmar" onPress={handleSubmit(onSubmit)} />
				<CustomButton
					style={{ backgroundColor: Colors.white }}
					textStyle={styles.customButtonText}
					title="Volver"
					onPress={() => navigation.goBack()}
				/>
			</View>
		</GeneralView>
	)
}

const FormNavigator = ({ control, handleSubmit, errors }: { control: any; handleSubmit: any; errors: any }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="RUT">{(props) => <RUT {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Pin">{(props) => <Pin {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="ConfirmPin">
				{(props) => <ConfirmPin {...props} control={control} errors={errors} handleSubmit={handleSubmit} />}
			</Stack.Screen>
		</Stack.Navigator>
	)
}

const App = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registerSchema),
	})

	return <FormNavigator control={control} handleSubmit={handleSubmit} errors={errors} />
}

const { width, height } = Dimensions.get("window")

export default App

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	inputError: {
		borderColor: "red",
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: -5,
		marginBottom: 10,
	},
	customButtonText: {
		color: Colors.green,
	},
})
