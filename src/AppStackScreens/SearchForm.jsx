import React, { useContext, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { getPropertyMasterDetail } from '../API/service';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { PropertyContext } from '../contexts/PropertyContext';

const SearchForm = ({ navigation }) => {
    const theme = useTheme();
    const [householdNo, setHouseholdNo] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { setProperty } = useContext(PropertyContext);
    const [properties, setProperties] = useState([]);
    const [showEmptyMessage, setShowEmptyMessage] = useState(false)

    const handleSearch = async () => {
        try {
            setProperties([])
            setIsLoading(true)
            const { data } = await getPropertyMasterDetail('householdNo', householdNo);
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                if (data.data.length === 0) {
                    setShowEmptyMessage(true);
                } else {
                    setShowEmptyMessage(false);
                    setProperties(data.data);
                }
            } else if (data.code === 404) {
                Alert.alert('Message', data.data)
            } else {
                Alert.alert('Fail', 'Failed while fetching property detail.')
            }
        } catch (e) {

            console.log(e)
            Alert.alert('Error', 'Error while fetching property detail.');
            setProperties([]);
            setShowEmptyMessage(false);
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = () => {
        setHouseholdNo('')
        setIsLoading(false)
        setProperties([]);
        setShowEmptyMessage(false);
    }


    const renderItems = ({ item }) => (
        <Pressable onPress={() => {
            setProperty(item);
            navigation.push('PropertyMenu');
        }} style={{ borderWidth: 0.5, borderColor: theme.colors.primary, width: '100%', padding: 4 }}>
            <View style={{}}>
                <Text variant='labelLarge' style={{color: theme.colors.primary}}>Owner Name: {item.ownerName}</Text>
                {item.householdNo ? <Text style={{ color: theme.colors.secondary }} variant='labelMedium'>PIN/Household No: {item.householdNo}</Text> : null}
                {item.surveyNo ? <Text style={{ color: theme.colors.secondary }} variant='labelMedium'>Survey No: {item.surveyNo}</Text> : null}
                {(item.careOf && item.guardianName) && <Text variant='labelSmall'>{item.careOf}:  {item.guardianName}</Text>}
                {item.gender && <Text variant='labelSmall'>Gender: {item.gender}</Text>}
                <Text variant='labelSmall'>Mobile: {item.mobile}</Text>
            </View>
        </Pressable>
    )

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <Loading visible={isLoading} />
            <Text variant="titleLarge" style={{ marginTop: 20, textAlign: 'center' }}>Search Property/Survey</Text>
            <View style={{ ...styles.formArea }}>
                <Input value={householdNo}
                    label="PIN/House Hold No./Survey No."
                    onChangeText={(nextValue) => {
                        setHouseholdNo(nextValue.toUpperCase())
                        setShowEmptyMessage(false);
                        setProperties([])
                    }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                    <Button disabled={isLoading || !householdNo} style={{ width: '40%' }} mode='contained' onPress={handleSearch}>Search</Button>
                    <Button style={{ width: '40%' }} mode='outlined' onPress={handleClear}>Clear</Button>
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                {
                    showEmptyMessage ? <Text style={{ textAlign: 'center' }}>No properties found with provided details.</Text> :
                        <FlatList data={properties} renderItem={renderItems} keyExtractor={item => item.propertyId} />
                }
            </View>
        </View >
    )
}

export default SearchForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    formArea: {
        // alignItems:'center',
        marginTop: 20,
        width: '100%',
        gap: 8,
    }
})