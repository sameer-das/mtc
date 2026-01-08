import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from './HomeStack';
const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeStack" component={HomeStack} />
  </Stack.Navigator>
);

export default AppStack;