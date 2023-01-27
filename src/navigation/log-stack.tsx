import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn, SignUp, ForgetPassword, ResetPassword } from '../screens';

const Stack = createNativeStackNavigator();

function LogStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
}

export default LogStack;