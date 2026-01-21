import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPropertyMasterDetail, getPropertySurveys } from '../../API/service';
import Loading from '../../components/Loading';
import { AuthContext } from '../../contexts/AuthContext';
import { PropertyContext } from '../../contexts/PropertyContext';

const SurveyList = () => {

    const safeAreaInsets = useSafeAreaInsets();
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const route = useRoute();
    const { setProperty } = useContext(PropertyContext);
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [survey, setSurveys] = useState([]);


    const fetchSurvey = async () => {
        console.log(user.username)
        try {
            setIsLoading(true);
            const { data } = await getPropertySurveys(user.username);
            console.log(data);
            if (data.code === 200 && data.status === 'Success') {
                setSurveys(data.data);
            }
        } catch (error) {
            Alert.alert('Error', `Error while fetching surveys for ${user.username}.`);

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchSurvey()
    }, []);



    const handleSearch = async (householdNo: string) => {
        try {
            setIsLoading(true)
            const { data } = await getPropertyMasterDetail(householdNo);
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                if (data.data.householdNo || data.data.attribute6) {
                    setProperty(data.data);
                    setIsLoading(false);
                    navigation.push('PropertyMenu');
                } else if (!data.data.householdNo || !data.data.attribute6) {
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

                    <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Survey No. : {item.attribute6}</Text>
                    <Text variant='titleSmall'>Name of Owner: {item.ownerName}</Text>
                </View>
                <Button mode='outlined' onPress={() => handleSearch(item.attribute6)}>View</Button>

            </View>

        </View>
    );


    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background, marginBottom: safeAreaInsets.bottom }}>
            <Loading visible={isLoading} />
            <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>All Surveys</Text>
            {survey.length === 0 ? <Text variant='bodyMedium'>No surveys found</Text> :
                <FlatList data={survey} renderItem={renderItem} keyExtractor={item => item.txnId} />
            }
        </View>
    )
}

export default SurveyList

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingHorizontal: 8
    }
})