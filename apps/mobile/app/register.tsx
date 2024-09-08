import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Camera from "@/components/register/camera"
import RUT from "@/components/register/views/rut"
import Email from "@/components/register/views/email"
import Pin from "@/components/register/views/pin"
import ConfirmPin from "@/components/register/views/confirmPin"
import DNI from "@/components/register/views/dni"
import RSH from "@/components/register/views/rsh"
import Final from "@/components/register/views/final"
import registerSchema from "@/utils/validation"

const Stack = createNativeStackNavigator()

const FormNavigator = ({ control, handleSubmit, errors, setValue }: { control: any; handleSubmit: any; errors: any; setValue: any }) => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="RUT">{(props) => <RUT {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Email">{(props) => <Email {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="Pin">{(props) => <Pin {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="ConfirmPin">{(props) => <ConfirmPin {...props} control={control} errors={errors} />}</Stack.Screen>
			<Stack.Screen name="DNI">{(props) => <DNI {...props} control={control} errors={errors} setValue={setValue} />}</Stack.Screen>
			<Stack.Screen name="RSH">
				{(props) => <RSH {...props} control={control} errors={errors} setValue={setValue} handleSubmit={handleSubmit} />}
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

	return <FormNavigator control={control} handleSubmit={handleSubmit} errors={errors} setValue={setValue} />
}

export default Register
