import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./register"
import Login from "./login"
import Menu from "./menu"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		<Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Menu" component={Menu} />
			<Stack.Screen name="Register" component={Register} />
			<Stack.Screen name="Login" component={Login} />
		</Stack.Navigator>
	)
}

export default App
