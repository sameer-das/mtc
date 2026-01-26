import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPropertyMasterDetail, getPropertySurveys } from '../API/service';
import Loading from '../components/Loading';
import { AuthContext } from '../contexts/AuthContext';
import { PropertyContext } from '../contexts/PropertyContext';

const ApproveProperty = () => {
  
    const safeAreaInsets = useSafeAreaInsets();
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const route = useRoute();
    const { setProperty } = useContext(PropertyContext);
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState([]);


    const fetchProperties = async () => {
        console.log(user.username)
        try {
            setIsLoading(true);
            // const { data } = await getPropertySurveys(user.username);
            const { data } = await getPropertyMasterDetail('attribute1', user.id);
            console.log(data);
            if (data.code === 200 && data.status === 'Success') {
                setProperties(data.data);
            }
        } catch (error) {
            Alert.alert('Error', `Error while fetching properties for ${user.username}.`);

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProperties()
    }, []);



    const handleSearch = async (propertyId: number) => {

        try {
            setIsLoading(true)
            const { data } = await getPropertyMasterDetail('propertyId', String(propertyId));
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                if (data.data[0]?.householdNo || data.data[0]?.surveyNo) {
                    setProperty(data.data[0]);
                    setIsLoading(false);
                    navigation.push('PropertyMenu');
                } else if (!data.data.householdNo || !data.data.surveyNo) {
                    Alert.alert('Not Found', 'Searched property not found.')
                }

            } else if (data.code === 404) {
                Alert.alert('Message', data.data)
            } else {
                Alert.alert('Fail', 'Failed while fetching property detail.')
            }
        } catch (e) {

            console.log(e)
            Alert.alert('Error', 'Error while fetching property detail.')
        } finally {
            setIsLoading(false)
        }
    }


    const renderItem = ({ item }) => (
        <View style={{ borderBottomColor: theme.colors.onBackground, borderBottomWidth: 1, paddingVertical: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text variant='titleSmall' selectable style={{ color: theme.colors.primary }}>Survey No. : {item.surveyNo}</Text>
                    {item.householdNo && <Text variant='bodyMedium' selectable style={{ color: theme.colors.primary }}>Household No. : {item.householdNo}</Text>}
                    <Text variant='titleSmall'>Name of Owner: {item.ownerName}</Text>
                </View>
                <Button mode='outlined' onPress={() => handleSearch(item.propertyId)}>View</Button>

            </View>

        </View>
    );


    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background, marginBottom: safeAreaInsets.bottom }}>
            <Loading visible={isLoading} />
            <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>Properties awaiting my approval</Text>
            {properties.length === 0 ? <Text variant='bodyMedium'>No records found</Text> :
                <FlatList data={properties} renderItem={renderItem} keyExtractor={item => item.propertyId} />
            }
        </View>
    )
}

export default ApproveProperty

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingHorizontal: 8
    }
})