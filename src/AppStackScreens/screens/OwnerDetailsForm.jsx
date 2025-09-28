import { ScrollView, StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import React, { useState } from 'react'
import Input from '../../components/Input'
import Dropdown from '../../components/Dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SALUTATION_OPTIONS = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Miss', value: 'Miss' },
];

const GENDER_OPTIONS = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
];

const CAREOF_OPTINS = [
    { label: 'Wife of', value: 'W/o' },
    { label: 'Son of', value: 'S/o' },
    { label: 'Doughter of', value: 'D/o' },
];


const OwnerDetailsForm = () => {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();


    const [ownerDetail, setOwnerDetail] = useState({
        salutation: '',
        ownerName: '',
        careOf: '',
        guardianName: '',
        gender: '',
        mobile: '',
        email: '',
        pan: '',
        aadhar: '',
        dob: '',
        isSpecialOwner: false,
    });

    const handleChange = (k) => {
        return (value) => {
            setOwnerDetail({ ...ownerDetail, [k]: value })
        }
    }
    console.log(theme)

    return (
        <KeyboardAvoidingView style={{ ...styles.container, backgroundColor: theme.colors.background }}>

            <Text variant="headlineSmall" style={{ textAlign: 'center' }}>Owner Details</Text>

            <ScrollView style={{ flexGrow: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column', gap: 8, }}>
                    <Dropdown options={SALUTATION_OPTIONS} label="Select Salutation" value={ownerDetail.salutation} onSelect={handleChange('salutation')} />
                    <Input label='Owner Name' value={ownerDetail.ownerName} onChangeText={handleChange('ownerName')} />
                    <Dropdown options={CAREOF_OPTINS} label="Select Care Of" value={ownerDetail.careOf} onSelect={handleChange('careOf')} />
                    <Input label='Father/Husband Name' value={ownerDetail.guardianName} onChangeText={handleChange('guardianName')} />
                    <Dropdown options={GENDER_OPTIONS} label="Select Gender" value={ownerDetail.gender} onSelect={handleChange('gender')} />
                    <Input label='Mobile' value={ownerDetail.mobile} onChangeText={handleChange('mobile')} />
                    <Input label='Email ID' value={ownerDetail.email} onChangeText={handleChange('email')} />
                    <Input label='Aadhar No.' value={ownerDetail.aadhar} onChangeText={handleChange('aadhar')} />
                    <Input label='PAN' value={ownerDetail.pan} onChangeText={handleChange('pan')} />
                    <Button style={{ marginBottom: safeAreaInsets.bottom }} mode='contained'>Update</Button>
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default OwnerDetailsForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    }
})