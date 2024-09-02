import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StyleSheet, View } from "react-native"
import Colors from "@/components/colors"
import Input from "@/components/register/input"
import GeneralView from "@/components/register/generalView"
import CustomButton from "@/components/register/button"
import registerSchema from "@/utils/validation"

const Stack = createNativeStackNavigator()

type commonProps = {
	navigation: any
	control?: any
	errors?: any
	handleSubmit?: any
}

const RUT = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView title="Datos del Registro" textCircle="1/7" textTitle="Ingresa tu RUT">
			<View>
				<View>
					<Input name="rut" placeholder="Ingresa tu RUT" control={control} errors={errors} />
				</View>
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("Email")} />
			</View>
		</GeneralView>
	)
}

const Email = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="2/7"
			textTitle="¿Deseas Ingresar Email?"
			textDescription="Este campo es opcional por lo que usted decice si ingresarlo"
		>
			<View>
				<View>
					<Input name="Email" placeholder="TuCorreo@gmail.com" control={control} errors={errors} />
				</View>
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("Pin")} />
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

const Pin = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView title="Datos del Registro" textCircle="3/7" textTitle="Ingresa tu Pin de 4 dígitos">
			<View>
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

const ConfirmPin = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView title="Datos del Registro" textCircle="4/7" textTitle="Vuelve a ingresar tu Pin">
			<View>
				<View>
					<Input name="pinConfirm" placeholder="Confirma tu PIN" control={control} errors={errors} secureTextEntry={true} />
				</View>
				<CustomButton title="Siguiente" onPress={() => navigation.navigate("Cedula")} />
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

const Cedula = ({ navigation, control, errors }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="5/7"
			textTitle="Sube tu Cédula de Identidad
                        por ambos lados"
			textDescription="Recuerda que la imagen debe ser legible y estar actualizada"
		>
			<View>
				<CustomButton style={{ marginTop: 30 }} title="Abrir Cámara" onPress={() => navigation.navigate("RSH")} />
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

const RSH = ({ navigation, control, errors, handleSubmit }: commonProps) => {
	const onSubmit = (data: any) => {
		console.log(data)
	}
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="6/7"
			textTitle="Sube tu Registro Social de Hogares"
			textDescription="Recuerda que la imagen debe ser legible y estar actualizada"
		>
			<View>
				<CustomButton
					style={{ marginTop: 30 }}
					title="Abrir Cámara"
					onPress={handleSubmit(onSubmit) && (() => navigation.navigate("Final"))}
				/>
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

const Final = ({ navigation }: commonProps) => {
	return (
		<GeneralView
			title="Datos del Registro"
			textCircle="7/7"
			textTitle="Todo Listo!"
			textDescription="Has completado el registro. Cuando la municipalidad valide tus datos seras notificado y podras solicitar horas"
		>
			<></>
		</GeneralView>
	)
}

const FormNavigator = ({ control, handleSubmit, errors }: { control: any; handleSubmit: any; errors: any }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="RUT">{(props) => <RUT {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Email">{(props) => <Email {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Pin">{(props) => <Pin {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="ConfirmPin">{(props) => <ConfirmPin {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Cedula">{(props) => <Cedula {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="RSH">{(props) => <RSH {...props} control={control} errors={errors} handleSubmit={handleSubmit} />}</Stack.Screen>
			<Stack.Screen name="Final">{(props) => <Final {...props} />}</Stack.Screen>
		</Stack.Navigator>
	)
}

const App = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			rut: "",
			pin: "",
			pinConfirm: "",
		},
		resolver: zodResolver(registerSchema),
	})

	return <FormNavigator control={control} handleSubmit={handleSubmit} errors={errors} />
}

export default App

const styles = StyleSheet.create({
	inputError: {
		borderColor: "red",
	},
	errorText: {
		flex: 1,
		color: "red",
		fontSize: 12,
		marginTop: -5,
		marginBottom: 10,
		alignSelf: "center",
		alignContent: "center",
		alignItems: "center",
		width: "auto",
	},
	customButtonText: {
		color: Colors.green,
	},
})
