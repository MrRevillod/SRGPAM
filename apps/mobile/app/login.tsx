import { createNativeStackNavigator } from "@react-navigation/native-stack"

import RUT from "@/components/login/rut"
import Pin from "@/components/login/pin"
import { useForm } from "react-hook-form"

const Stack = createNativeStackNavigator()

const FormNavigator = ({ control, handleSubmit, errors, trigger }: { control: any; handleSubmit: any; errors: any; setValue: any; trigger: any }) => {
	const validateAndNavigate = async (field: string, navigation: any, nextScreen: string) => {
		const isValid = await trigger(field)
		if (isValid) {
			navigation.navigate(nextScreen)
		}
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="RUT">
				{(props) => <RUT {...props} control={control} errors={errors} validateAndNavigate={validateAndNavigate} />}
			</Stack.Screen>
			<Stack.Screen name="Pin">{(props) => <Pin {...props} control={control} errors={errors} handleSubmit={handleSubmit} />}</Stack.Screen>
		</Stack.Navigator>
	)
}

const Login = () => {
	const {
		control,
		handleSubmit,
		setValue,
		trigger, // Esto se usará para validar un campo individualmente
		formState: { errors },
	} = useForm({
		defaultValues: {
			rut: "",
			pin: "",
		},
	})

	return <FormNavigator control={control} handleSubmit={handleSubmit} errors={errors} setValue={setValue} trigger={trigger} />
}

export default Login
