import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import HomeStack from './screens/HomeStack';
const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeStack" component={HomeStack} />
  </Stack.Navigator>
);

export default AppStack;