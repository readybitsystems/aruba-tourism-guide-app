import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome, Tours, Location, Places, VideoScreen, Profile } from '../screens';

const Stack = createNativeStackNavigator();

function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Tours" component={Tours} />
            <Stack.Screen name="Places" component={Places} />
            <Stack.Screen name="VideoScreen" component={VideoScreen} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
}

export default AppStack;