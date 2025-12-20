import { Alert, StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import Input from '../../components/Input'
import { ProgressBar, MD3Colors } from 'react-native-paper';
import Loading from '../../components/Loading';
import { getPropertyMasterDetail } from '../../API/service';
import { PropertyContext } from '../../contexts/PropertyContext';

const SearchForm = ({ navigation }) => {
    const theme = useTheme();
    const [householdNo, setHouseholdNo] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const {setProperty} = useContext(PropertyContext)

    const handleSearch = async () => {
        try {
            setIsLoading(true)
            const resp = await getPropertyMasterDetail(householdNo);
            console.log(resp)
            if (resp.data.code === 200 && resp.data.status === 'Success') {
                setProperty(resp.data.data);
                navigation.push('PropertyMenu');
            } else if (resp.data.code === 404) {
                Alert.alert('Message', resp.data.data)
            } else {
                Alert.alert('Fail','Failed while fetching property detail.')
            }
        } catch (e) {

            console.log(e)
            Alert.alert('Error','Error while fetching property detail.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = () => {
        setHouseholdNo('')
        setIsLoading(false)
    }

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <Loading visible={isLoading} />
            <Text variant="titleLarge" style={{ marginTop: 160  }}>Search Property</Text>
            <View style={{ ...styles.formArea }}>
                <Input value={householdNo}
                    label="PIN/House Hold No"
                    onChangeText={(nextValue) => setHouseholdNo(nextValue)} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                    <Button disabled={isLoading || !householdNo} style={{ width: '40%' }} mode='contained' onPress={handleSearch}>Search</Button>
                    <Button style={{ width: '40%' }} mode='outlined' onPress={handleClear}>Clear</Button>
                </View>
            </View>
        </View>
    )
}

export default SearchForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
    },
    formArea: {
        // alignItems:'center',
        width: '100%',
        gap: 8,
    }
})