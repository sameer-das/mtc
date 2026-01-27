import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import AadharAndPan from './AadharAndPan';
import AfterPropertySearchMenu from './AfterPropertySearchMenu';
import FirstForm from './CreatePropertyStack/FirstForm';
import DemandList from './DemandStack/DemandList';
import ListDemandTxns from './DemandStack/ListDemandTxns';
import PaymentCollection from './DemandStack/PaymentCollection';
import ViewBillPdf from './DemandStack/ViewBillPdf';
import ViewDemandPdf from './DemandStack/ViewDemandPdf';
import HomeScreen from './HomeScreen';
import SearchForm from './SearchForm';
import SurveyList from './SurveyListStack/SurveyList';
import OwnerDetailsForm from './UpdateDetailsStack/OwnerDetailsForm';
import AddFloorData from './UpdateDetailsStack/property-detail-form/AddFloorData';
import PropertyDetailsForm from './UpdateDetailsStack/PropertyDetailsForm';
import ApproveProperty from './ApproveProperty';
import ApprovalHistory from './ApprovalHistory';

const Stack = createNativeStackNavigator();
const TopTabs = createMaterialTopTabNavigator();

const FormStack = () => {
    const theme = useTheme()
    return (
        <TopTabs.Navigator screenOptions={{
            tabBarStyle: { backgroundColor: theme.colors.primary },
            tabBarActiveTintColor: theme.colors.onPrimary,
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }
        }}>
            <TopTabs.Screen name='Owner Details' component={OwnerDetailsForm} />
            <TopTabs.Screen name='Property Details' component={PropertyDetailsForm} />
        </TopTabs.Navigator >
    )
}

const UpdateDetailsStack = () => {
    return (<Stack.Navigator screenOptions={({ route }) => {
        return { headerShown: false }
    }}>

        <Stack.Screen name='FormStack' component={FormStack} />
        <Stack.Screen name='AddFloorData' component={AddFloorData} />
    </Stack.Navigator>)
}


const DemandStack = () => {
    return (<Stack.Navigator screenOptions={({ route }) => {
        return { headerShown: false }
    }}>
        <Stack.Screen name='DemandList' component={DemandList} />
        <Stack.Screen name='PaymentCollection' component={PaymentCollection} />
        <Stack.Screen name='ViewDemandPdf' component={ViewDemandPdf} />
        <Stack.Screen name='ListDemandTxns' component={ListDemandTxns} />
        <Stack.Screen name='ViewBillPdf' component={ViewBillPdf} />
    </Stack.Navigator>)
}



const CreatePropertyStack = () => {
    return (<Stack.Navigator screenOptions={({ route }) => {
        return { headerShown: false }
    }}>
        <Stack.Screen name='FirstForm' component={FirstForm} />
    </Stack.Navigator>)
}



const SurveyListStack = () => {
    return (<Stack.Navigator screenOptions={({ route }) => {
        return { headerShown: false }
    }}>
        <Stack.Screen name='SurveyList' component={SurveyList} />
    </Stack.Navigator>)
}



const ApprovalListStack = () => {
    return (<Stack.Navigator screenOptions={({ route }) => {
        return { headerShown: false }
    }}>
        <Stack.Screen name='ApproveProperty' component={ApproveProperty} />
    </Stack.Navigator>)
}



const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={({ route }) => {
            return { headerShown: false }
        }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchForm} />
            <Stack.Screen name="PropertyMenu" component={AfterPropertySearchMenu} />
            <Stack.Screen name="ApprovalHistory" component={ApprovalHistory} />
            <Stack.Screen name="CreatePropertyStack" component={CreatePropertyStack} />
            <Stack.Screen name="SurveyListStack" component={SurveyListStack} />
            <Stack.Screen name="UpdateDetailsStack" component={UpdateDetailsStack} />
            <Stack.Screen name="AadharAndPan" component={AadharAndPan} />
            <Stack.Screen name="DemandStack" component={DemandStack} />
            <Stack.Screen name="ApprovalListStack" component={ApprovalListStack} />
        </Stack.Navigator>
    )
}

export default HomeStack

const styles = StyleSheet.create({})