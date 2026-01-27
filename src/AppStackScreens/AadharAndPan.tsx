import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Input from '../components/Input'
import { Button, Text, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PopertyNumberBanner from './PopertyNumberBanner';
import CustomImagePicker from '../components/CustomImagePicker';
import { PropertyDocumentUploadPayload, PropertyMaster } from '../Models/models';
import { AuthContext } from '../contexts/AuthContext';
import { PropertyContext } from '../contexts/PropertyContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { propertyDocumentList, propertyDocumentUpload, updatePropertyMaster } from '../API/service';
import Loading from '../components/Loading';
import { API_BASE_URL } from '../API/ApiClient';

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


const getFileName = (filename: string) => {
    const splited = filename.split('.');
    splited.splice(-1, 1) // delete the last extension one 
    return splited.join('_');
}

const AadharAndPan = () => {
    const theme = useTheme();
    const { user } = useContext(AuthContext);
    const { property } = useContext(PropertyContext);
    const [loading, setLoading] = useState(false);
    const safeAreaInsets = useSafeAreaInsets();

    const [initialValue, setInitialValue] = useState<AadharPanType>({
        pan: property?.pan || '',
        aadhar: property?.aadhar || ''
    });


    const [aadharFront, setAadharFront] = useState('');
    const [aadharBack, setAadharBack] = useState('');
    const [panImage, setPanImage] = useState('');


    const handleUpdateAadharPan = async (value: AadharPanType) => {
        console.log(value)
        const payload: PropertyMaster = {
            propertyId: property?.propertyId,
            updatedBy: user.username,
            aadhar: value.aadhar,
            pan: value.pan
        }


        try {
            setLoading(true)
            const resp = await updatePropertyMaster(payload);

            if (resp.data.code === 200 && resp.data.status === 'Success') {
                Alert.alert('Success', 'Address updated successfully');
            } else {
                Alert.alert('Fail', 'Failed while updating address.')
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Error while updating address.')
        } finally {
            setLoading(false)
        }
    }


    const fetchDocumentList = async () => {
        console.log("fetchDocumentList")

        try {
            const { data } = await propertyDocumentList(property?.propertyId || 0);
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                for (let d of data.data) {
                    if (d.documentType === 'Owner_Aadhar_Front') {
                        setAadharFront(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
                    } else if (d.documentType === 'Owner_Aadhar_Back') {
                        setAadharBack(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
                    } else if (d.documentType === 'Owner_Pan') {
                        setPanImage(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
                    }
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Error getting document list of property.');
            console.log(error);
        }
    }



    useEffect(() => {
        fetchDocumentList()
    }, [])



    const handleUpload = async (filemetadata: any) => {

        setLoading(true);

        try {
            const payload: PropertyDocumentUploadPayload = {
                documentId: 0,
                documentName: getFileName(filemetadata.filename),
                documentType: filemetadata.identifier,
                documentUploadedBy: user.id,
                documentUploadedOn: new Date().toISOString(),
                propertyId: property?.propertyId || 0,
                documentContent: filemetadata.imageContent
            }
            // console.log(payload)
            const { data } = await propertyDocumentUpload(payload);
            console.log(data);

            if (data.code === 200 && data.status === 'Success') {
                Alert.alert('Success', 'Image uploaded successfully.')
            } else {
                Alert.alert('Fail', 'Image upload failed.')
            }

        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Image upload error.')
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <PopertyNumberBanner />
            <Loading visible={loading} />
            <Text variant="titleMedium" style={{ textAlign: 'center', marginVertical: 8 }}>Aadhar/PAN of Owner</Text>
            <Formik enableReinitialize={true} initialValues={initialValue} onSubmit={handleUpdateAadharPan} validationSchema={aadharPanValidationSchema} >
                {({ values, errors, handleChange, handleSubmit, isValid, setFieldValue }) => {
                    return <ScrollView>
                        <Input maxLength={12} label='Aadhar' value={values.aadhar} onChangeText={handleChange('aadhar')} />
                        {/* For Validation Error Text */}
                        <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.aadhar ? errors.aadhar : null}</Text>
                            </View>
                        </View>
                        <Input maxLength={10} label='PAN' value={values.pan} onChangeText={(value: string) => setFieldValue('pan', value.trim().toUpperCase(), true)} />
                        {/* For Validation Error Text */}
                        <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.pan ? errors.pan : null}</Text>
                            </View>
                        </View>
                        <Button style={{ marginTop: 8, marginBottom: 16 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Details</Button>
                        <View style={{ marginBottom: 100 }}>
                            <CustomImagePicker identifier='Owner_Aadhar_Front' label='Aadhar Image (Front Side)' value={aadharFront} setValue={(v: string) => setAadharFront(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
                            <CustomImagePicker identifier='Owner_Aadhar_Back' label='Aadhar Image (Back Side)' value={aadharBack} setValue={(v: string) => setAadharBack(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
                            <CustomImagePicker identifier='Owner_Pan' label='PAN Image (Front Side)' value={panImage} setValue={(v: string) => setPanImage(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
                        </View>
                    </ScrollView>
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