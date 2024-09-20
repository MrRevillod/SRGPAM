import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./register"
import Login from "./login"
import Menu from "../screens/menu"
import Profile from "../screens/myProfile"

const Stack = createNativeStackNavigator()

const App = () => {
	return (
		<Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Menu" component={Menu} />
			<Stack.Screen name="Register" component={Register} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Profile" component={Profile} />
		</Stack.Navigator>
	)
}

export default App
