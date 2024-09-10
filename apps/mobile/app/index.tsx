import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./register"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		<Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Register" component={Register} />
		</Stack.Navigator>
	)
}

export default App
