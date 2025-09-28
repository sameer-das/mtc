import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import Input from '../../components/Input'
import { ProgressBar, MD3Colors } from 'react-native-paper';

const SearchForm = ({ navigation }) => {
    const theme = useTheme();
    const [householdNo, setHouseholdNo] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSearch = () => {
        // navigation.push()
        // setIsLoading(true)
        navigation.push('FormStack')
    }

    const handleClear = () => {
        setHouseholdNo('')
        setIsLoading(false)
    }

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <Text variant="titleLarge" style={{ marginVertical: 24 }}>Search Property</Text>
            <View style={{ ...styles.formArea }}>
                <Input value={householdNo}
                    label="PIN/House Hold No"
                    onChangeText={(nextValue) => setHouseholdNo(nextValue)} />
                <View style={{height: 4}}>
                    {isLoading && <ProgressBar visible={isLoading} color={theme.colors.primary} indeterminate />}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                    <Button disabled={isLoading} style={{ width: '40%' }} mode='contained' onPress={handleSearch}>Search</Button>
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
        padding: 8
    },
    formArea: {
        // alignItems:'center',
        width: '100%',
        gap: 8,
    }
})