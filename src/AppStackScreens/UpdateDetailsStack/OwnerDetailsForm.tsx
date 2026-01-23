import { Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Yup from 'yup'
import { getPropertyMasterDetail, updatePropertyMaster } from '../../API/service'
import Datepicker from '../../components/Datepicker'
import Dropdown from '../../components/Dropdown'
import Input from '../../components/Input'
import Loading from '../../components/Loading'
import { CAREOF_OPTIONS, GENDER_OPTIONS, SALUTATION_OPTIONS } from '../../constants/constants'
import { AuthContext } from '../../contexts/AuthContext'
import { PropertyContext } from '../../contexts/PropertyContext'
import { PropertyMaster, SelectType } from '../../Models/models'
import PopertyNumberBanner from '../PopertyNumberBanner'


interface OwnerDetailType {
    salutation: SelectType,
    ownerName: string,
    careOf: SelectType,
    guardianName: string,
    gender: SelectType,
    mobile: string,
    dob: Date,
}





const ownerDetailSchema = Yup.object().shape({
    // salutation: Yup.string().required('Please choose salutation'),
    ownerName: Yup.string().matches(/^[a-zA-Z ]*$/, 'Only alphabets are allowed in Owner Name.'),
    // careOf: Yup.string().required('Please choose care of'),
    guardianName: Yup.string().matches(/^[a-zA-Z ]*$/, 'Only alphabets are allowed in care of name.'),
    // gen  der: Yup.string().required('Please choose gender'),
    mobile: Yup.string().matches(/^[0-9]+$/, 'Only digits are allowed').min(10, 'Mobile number should be of 10 digits.').max(10, 'Mobile number should be of 10 digits.'),
    dob: Yup.date().max(new Date(), 'Date of birth cannot be in the future')
})

const getDate = (date: Date | string) => {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
}


const OwnerDetailsForm = () => {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const { property, setProperty } = useContext(PropertyContext);

    const [initialValue, setInitialValue] = useState<OwnerDetailType>({
        salutation: SALUTATION_OPTIONS.find(opt => opt.value === property?.salutation) || SALUTATION_OPTIONS[0],
        ownerName: property?.ownerName || '',
        careOf: CAREOF_OPTIONS.find(opt => opt.value === property?.careOf) || CAREOF_OPTIONS[0],
        guardianName: property?.guardianName || '',
        gender: GENDER_OPTIONS.find(opt => opt.value === property?.gender) || GENDER_OPTIONS[0],
        mobile: property?.mobile || '',
        dob: property?.dob ? new Date(property.dob) : new Date(),
    });



    const handleUpdateOwner = async (values: OwnerDetailType) => {

        const payload: PropertyMaster = {
            propertyId: property?.propertyId,
            householdNo: property?.householdNo,
            ownerName: values.ownerName,
            salutation: values.salutation.value as string,
            careOf: values.careOf.value as string,
            guardianName: values.guardianName,
            gender: values.gender.value as string,
            dob: getDate(values.dob.toISOString()),
            mobile: values.mobile,
            updatedBy: user.username
        }

        try {
            setLoading(true)
            const resp = await updatePropertyMaster(payload);

            if (resp.data.code === 200 && resp.data.status === 'Success') {
                Alert.alert('Success', 'Details updated successfully');

                const { data: updatedPropertyResp } = await getPropertyMasterDetail('householdNo', String(property?.householdNo || property?.surveyNo));
                console.log(updatedPropertyResp)
                if (updatedPropertyResp.code === 200 && updatedPropertyResp.status === 'Success') {
                    if (updatedPropertyResp.data.length > 0)
                        setProperty(updatedPropertyResp.data[0]);
                }

            } else {
                Alert.alert('Fail', 'Failed while updating details.')
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Error while updating details.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView behavior="height" style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <Loading visible={loading} />
            <PopertyNumberBanner />

            <Text variant="titleMedium" style={{ textAlign: 'center', marginVertical: 8 }}>Owner Details</Text>

            <ScrollView style={{ flexGrow: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column', marginBottom: safeAreaInsets.bottom + 80 }}>
                    <Formik enableReinitialize={true} initialValues={initialValue} onSubmit={handleUpdateOwner} validationSchema={ownerDetailSchema}>
                        {({ values, errors, handleChange, handleSubmit, isValid, setFieldValue }) => (<View style={{ flex: 1, flexDirection: 'column', }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ width: '25%' }}>
                                    <Dropdown options={SALUTATION_OPTIONS} label="Salutation" value={values.salutation} onSelect={(sal: SelectType) => setFieldValue('salutation', sal)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input label='Owner Name' value={values.ownerName} onChangeText={handleChange('ownerName')} />
                                </View>
                            </View>
                            {/* For Validation Error Text */}
                            <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ width: '25%' }}>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.ownerName ? errors.ownerName : null}</Text>
                                </View>
                            </View>


                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ width: '25%' }}>
                                    <Dropdown options={CAREOF_OPTIONS} label="Care Of" value={values.careOf} onSelect={(co: SelectType) => setFieldValue('careOf', co)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input label='Care Of Name' value={values.guardianName} onChangeText={handleChange('guardianName')} />
                                </View>
                            </View>
                            {/* For Validation Error Text */}
                            <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ width: '25%' }}>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.guardianName ? errors.guardianName : null}</Text>
                                </View>
                            </View>


                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ width: '25%' }}>
                                    <Dropdown options={GENDER_OPTIONS} label="Gender" value={values.gender} onSelect={(g: SelectType) => setFieldValue('gender', g)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Datepicker date={values.dob} onConfirm={(d: Date) => setFieldValue('dob', d)} label='Date of Birth' />
                                </View>
                            </View>
                            {/* For Validation Error Text */}
                            <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ width: '25%' }}>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.error, fontSize: 12 }}>{JSON.stringify(errors.dob) ? JSON.stringify(errors.dob) : null}</Text>
                                </View>
                            </View>

                            <Input maxLength={10} label='Mobile' value={values.mobile} onChangeText={handleChange('mobile')} />
                            {/* For Validation Error Text */}
                            <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.mobile ? errors.mobile : null}</Text>
                                </View>
                            </View>
                            <Button style={{ marginTop: 8 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Owner Detail</Button>
                            {/* <Text>{JSON.stringify(errors.dob)}</Text> */}
                        </View>)
                        }
                    </Formik>
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
    },
})