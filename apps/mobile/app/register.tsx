import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Camera from "@/components/camera"
import RUT from "@/screens/register/rut"
import Email from "@/screens/register/email"
import Pin from "@/screens/register/pin"
import ConfirmPin from "@/screens/register/confirmPin"
import DNI from "@/screens/register/dni"
import Social from "@/screens/register/social"
import Final from "@/screens/register/final"
import registerSchema from "@/utils/validation"

const Stack = createNativeStackNavigator()

const FormNavigator = ({
	control,
	handleSubmit,
	errors,
	setValue,
	getValues,
	trigger,
	setError,
}: {
	control: any
	handleSubmit: any
	errors: any
	setValue: any
	trigger: any
	setError: any
	getValues: any
}) => {
	const validateAndNavigate = async (field: string, navigation: any, nextScreen: string) => {
		const isValid = await trigger(field)
		if (isValid) {
			navigation.navigate(nextScreen)
		}
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="RUT">
				{(props) => (
					<RUT
						{...props}
						control={control}
						errors={errors}
						getValues={getValues}
						validateAndNavigate={validateAndNavigate}
						setError={setError}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen name="Email">
				{(props) => <Email {...props} control={control} errors={errors} validateAndNavigate={validateAndNavigate} setError={setError} />}
			</Stack.Screen>
			<Stack.Screen name="Pin">
				{(props) => <Pin {...props} control={control} errors={errors} validateAndNavigate={validateAndNavigate} />}
			</Stack.Screen>
			<Stack.Screen name="ConfirmPin">
				{(props) => <ConfirmPin {...props} control={control} errors={errors} validateAndNavigate={validateAndNavigate} />}
			</Stack.Screen>
			<Stack.Screen name="DNI">{(props) => <DNI {...props} control={control} errors={errors} setValue={setValue} />}</Stack.Screen>
			<Stack.Screen name="Social">
				{(props) => <Social {...props} control={control} errors={errors} setValue={setValue} handleSubmit={handleSubmit} />}
			</Stack.Screen>
			<Stack.Screen name="Final">{(props) => <Final {...props} />}</Stack.Screen>
			<Stack.Screen name="Camera" component={Camera} options={{ headerShown: true }} />
		</Stack.Navigator>
	)
}

const Register = () => {
	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		trigger,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			rut: "",
			email: "",
			pin: "",
			pinConfirm: "",
			dni_a: "",
			dni_b: "",
			social: "",
		},
		resolver: zodResolver(registerSchema),
	})

	return (
		<FormNavigator
			control={control}
			handleSubmit={handleSubmit}
			errors={errors}
			setValue={setValue}
			getValues={getValues}
			trigger={trigger}
			setError={setError}
		/>
	)
}

export default Register
