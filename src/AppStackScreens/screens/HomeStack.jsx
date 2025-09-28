import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './HomeScreen';
import SearchForm from './SearchForm';
import OwnerDetailsForm from './OwnerDetailsForm';
import PropertyDetailsForm from './PropertyDetailsForm'
import { useTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const TopTabs = createMaterialTopTabNavigator();

const FormStack = () =>{
    const theme = useTheme()
    return (
        <TopTabs.Navigator screenOptions={{
            tabBarStyle: {backgroundColor: theme.colors.primary},
            tabBarActiveTintColor: theme.colors.onPrimary,
            tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'}

        }}>
            <TopTabs.Screen name='Owner Details' component={OwnerDetailsForm} />
            <TopTabs.Screen name='Property Details' component={PropertyDetailsForm} />
        </TopTabs.Navigator>
    )
}

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={({route}) => {
            // console.log(route)
            return { headerShown: false}
        }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchForm} />
            <Stack.Screen name="FormStack" component={FormStack} />
        </Stack.Navigator>
    )
}

export default HomeStack

const styles = StyleSheet.create({})