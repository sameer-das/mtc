import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Switch, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PropertyContext } from '../contexts/PropertyContext';
import { AuthContext } from '../contexts/AuthContext';
import { getApprovalLog, getDemandsTxnOfProperty } from '../API/service';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TRANSACTION_REMARKS } from '../constants/constants';
import Loading from '../components/Loading';

const ApprovalHistory = () => {
    const safeAreaInsets = useSafeAreaInsets();
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const route = useRoute();
    const { property } = useContext(PropertyContext);
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);


    const fetchApprovalHistory = async () => {
        console.log(user.username)
        try {
            setIsLoading(true);
            // const { data } = await getPropertySurveys(user.username);
            const { data } = await getApprovalLog(Number(property?.propertyId));
            console.log(data);
            if (data.code === 200 && data.status === 'Success') {
                setHistory(data.data);
            }
        } catch (error) {
            Alert.alert('Error', `Error while fetching history for ${user.username}.`);

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchApprovalHistory()
    }, []);






    const renderItem = ({ item }) => (
        <View style={{ borderBottomColor: theme.colors.onBackground, borderBottomWidth: 1, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text variant='titleSmall' selectable style={{ color: theme.colors.primary }}>Survey No. : {item.surveyNo}</Text>
                    {item.householdNo && <Text variant='bodyMedium' selectable style={{ color: theme.colors.primary }}>Household No. : {item.householdNo}</Text>}
                    <Text variant='titleSmall'>Name of Owner: {item.ownerName}</Text>
                </View>
                {/* <Button mode='outlined' onPress={() => handleSearch(item.propertyId)}>View</Button> */}

            </View>

        </View>
    );


    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background, marginBottom: safeAreaInsets.bottom }}>
            <Loading visible={isLoading} />
            <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>Approval History</Text>
            {/* {history.length === 0 ? <Text variant='bodyMedium'>No records found</Text> :
                <FlatList data={history} renderItem={renderItem} keyExtractor={item => item.propertyId} />
            } */}
        </View>
    )
}

export default ApprovalHistory

const styles = StyleSheet.create({
    container: {
    flex: 1, paddingHorizontal: 8
  }
})