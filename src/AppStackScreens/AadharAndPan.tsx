import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import Input from '../components/Input'
import { Button, Text, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PopertyNumberBanner from './PopertyNumberBanner';

interface AadharPanType {
    aadhar: string;
    pan: string;
}

const aadharPanValidationSchema = Yup.object().shape({
  aadhar: Yup.string()
    .nullable()
    // Transform empty strings to null so they don't trigger digit validation
    .transform((value) => (value === "" ? null : value))
    .matches(/^[0-9]{12}$/, "Aadhar must be exactly 12 digits"),
    
  pan: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    // Standard PAN format: 5 letters, 4 digits, 1 letter
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format")
    .length(10, "PAN must be exactly 10 characters")
})

const AadharAndPan = () => {
    const theme = useTheme();
    const [initialValue, setInitialValue] = useState<AadharPanType>({
        pan: '',
        aadhar: ''
    });


    const handleUpdateAadharPan = (value: AadharPanType) => {
        console.log(value)
    }


    return (
        <View style={{...styles.container, backgroundColor: theme.colors.background}}>
            <PopertyNumberBanner />
            <Text variant="titleMedium" style={{ textAlign: 'center', marginVertical: 8 }}>Update Aadhar and PAN</Text>
            <Formik enableReinitialize={true} initialValues={initialValue} onSubmit={handleUpdateAadharPan} validationSchema={aadharPanValidationSchema} >
                {({ values, errors, handleChange, handleSubmit, isValid, setFieldValue }) => {
                    return <View>
                        <Input maxLength={12} label='Aadhar' value={values.aadhar} onChangeText={handleChange('aadhar')} />
                        {/* For Validation Error Text */}
                        <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.aadhar ? errors.aadhar : null}</Text>
                            </View>
                        </View>
                        <Input maxLength={10} label='PAN' value={values.pan} onChangeText={handleChange('pan')} />
                        {/* For Validation Error Text */}
                        <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.pan ? errors.pan : null}</Text>
                            </View>
                        </View>
                        <Button style={{ marginTop: 8 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Details</Button>
                    </View>
                }}
            </Formik>

        </View>
    )
}

export default AadharAndPan

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
})