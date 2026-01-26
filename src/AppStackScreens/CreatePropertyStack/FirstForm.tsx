import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import Dropdown from '../../components/Dropdown';
import Input from '../../components/Input';
import { CAREOF_OPTIONS, SALUTATION_OPTIONS } from '../../constants/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { QuickCreatePropertyType, SelectType } from '../../Models/models';
import { getCategories, getMohallaList, getPropertyMasterDetail, getPropertyType, getSubCategoriesOfCategory, getWardList, getZoneList, quickCreateProperty } from '../../API/service';
import { PropertyContext } from '../../contexts/PropertyContext';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';


interface FormType {
    salutation: SelectType,
    ownerName: '',
    // careOf: '',
    // guardianName: '',
    mobile: '',

    propertyType: SelectType,
    zone: SelectType,
    ward: SelectType,
    mohallaName: SelectType,
    category: SelectType,
    subCategory: SelectType
}

const FirstForm = () => {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const { user } = useContext(AuthContext);
    const { setProperty } = useContext(PropertyContext);
    const navigation = useNavigation();


    const [propertyTypeOptions, setPropertyTypeOptions] = useState<SelectType[]>([]);
    const [zoneOptions, setZoneOptions] = useState<SelectType[]>([]);
    const [wardOptions, setWardOptions] = useState<SelectType[]>([]);
    const [mohallaOptions, setMohallaOptions] = useState<SelectType[]>([]);
    const [categryOptions, setCategoryOptions] = useState<SelectType[]>([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState<SelectType[]>([]);

    const [isLoading, setIsLoading] = useState(false);


    const initialValue: FormType = {
        salutation: '',
        ownerName: '',
        // careOf: '',
        // guardianName: '',
        mobile: '',

        propertyType: '',
        zone: '',
        ward: '',
        mohallaName: '',
        category: '',
        subCategory: ''
    }


    const validationSchema = Yup.object().shape({
        // salutation: Yup.string().required('Please choose salutation'),
        ownerName: Yup.string().required('Please enter owner name.').matches(/^[a-zA-Z ]*$/, 'Only alphabets are allowed in Owner Name.'),
        // careOf: Yup.string().required('Please choose care of'),
        // guardianName: Yup.string().required('Please enter guardian name.').matches(/^[a-zA-Z ]*$/, 'Only alphabets are allowed in care of name.'),
        mobile: Yup.string().required('Please enter mobile no.').matches(/^[0-9]+$/, 'Only digits are allowed').min(10, 'Mobile number should be of 10 digits.').max(10, 'Mobile number should be of 10 digits.'),
    })



    const fetchPropertyType = async () => {
        try {
            const { data } = await getPropertyType(0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setPropertyTypeOptions(data.data.propertyTypes.map(cur => ({ label: cur.propertyTypeName, value: cur.propertyTypeName })));
            }
        } catch (error) {

        }
    }



    const fetchWard = async (zoneId: number) => {
        try {
            // console.log('fetch ward ', zoneId)
            const { data } = await getWardList(zoneId, 0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setWardOptions(data.data.wards.map(cur => ({ label: cur.wardNumber, value: cur.wardId })))
            }
        } catch (error) {

        }
    }



    const fetchZones = async () => {
        try {
            const { data } = await getZoneList(0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setZoneOptions(data.data.zones.map(cur => ({ label: cur.zoneName, value: cur.zoneId })));
            }

        } catch (error) {

        }
    }



    const fetchMohalla = async () => {
        try {
            const { data } = await getMohallaList(0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setMohallaOptions(data.data.mohallas.map(cur => ({ label: cur.mohallaName, value: cur.mohallaId })));
            }

        } catch (error) {

        }
    }



    const fetchSubCategories = async (categoryId: number) => {
        try {
            console.log('fetch sub cat ', categoryId)
            const { data } = await getSubCategoriesOfCategory(categoryId, 0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setSubCategoryOptions(data.data.subCategories.map(cur => ({ label: cur.subCategoryName, value: cur.subCategoryId })))
            }
        } catch (error) {

        }
    }



    const fetchCategories = async () => {
        try {
            const { data } = await getCategories(0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setCategoryOptions(data.data.categories.map(cur => ({ label: cur.categoryName, value: cur.categoryId })));
            }

        } catch (error) {

        }
    }



    useEffect(() => {
        fetchPropertyType();
        fetchZones();
        fetchMohalla();
        fetchCategories();
    }, [])


    const handleSearch = async (householdNo: string) => {
        try {
            setIsLoading(true)
            const { data } = await getPropertyMasterDetail(householdNo);
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                if (data.data.householdNo || data.data.surveyNo) {
                    setProperty(data.data);
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





    const handleCreateProperty = async (value: FormType) => {
        for (let key in value) {
            if (value[key] === '') {
                Alert.alert('Validation Error', `Please enter value for ${key}`);
                return;
            }
        }
        console.log(value);
        const paylod: QuickCreatePropertyType = {
            salutation: value.salutation.value,
            ownerName: value.ownerName,
            careOf: '',
            guardianName: '',
            mobile: value.mobile,
            householdNo: '',
            propertyType: String(value.propertyType.value),
            zone: value.zone.value,
            ward: value.ward.value,
            mohallaName: String(value.mohallaName.value),
            category: value.category.value,
            subCategory: value.subCategory.value,
            updatedBy: user.username,
        }
        console.log(paylod);
        // await handleSearch('AAAAAAA')
        try {
            setIsLoading(true)
            const { data } = await quickCreateProperty(paylod);
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                Alert.alert('Success', `Property added successfully. Survey No. : ${data.data}`, [
                    {text: 'OK', onPress: async () => {
                        await handleSearch(data.data);
                    }}
                ] )
            } else {
                Alert.alert('Fail', 'Failed to add property.')
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Error while adding property details.')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <ScrollView style={{ ...styles.container, backgroundColor: theme.colors.background, paddingBottom: safeAreaInsets.bottom + 40 }}>
            <Loading visible={isLoading} />
            <View style={{ marginBottom: safeAreaInsets.bottom + 10 }}>

                <Text variant="titleMedium" style={{ textAlign: 'center', marginVertical: 8 }}>Owner Details</Text>
                <View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Formik enableReinitialize={true} initialValues={initialValue}
                            onSubmit={handleCreateProperty} validationSchema={validationSchema}>
                            {
                                ({ values, errors, handleChange, handleSubmit, isValid, setFieldValue }) => (<View style={{}}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                        <View style={{ width: '25%' }}>
                                            <Dropdown options={SALUTATION_OPTIONS} label="Salutation" value={values.salutation} onSelect={(sal: SelectType) => setFieldValue('salutation', sal)} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Input label='Owner Name' value={values.ownerName} onChangeText={handleChange('ownerName')} />
                                        </View>
                                    </View>
                                    <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                        <View style={{ width: '25%' }}>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.ownerName ? errors.ownerName : null}</Text>
                                        </View>
                                    </View>


                                    {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                        <View style={{ width: '25%' }}>
                                            <Dropdown options={CAREOF_OPTIONS} label="Care Of" value={values.careOf} onSelect={(co: SelectType) => setFieldValue('careOf', co)} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Input label='Care Of Name' value={values.guardianName} onChangeText={handleChange('guardianName')} />
                                        </View>
                                    </View>
                                 
                                    <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                        <View style={{ width: '25%' }}>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.guardianName ? errors.guardianName : null}</Text>
                                        </View>
                                    </View> */}

                                    <View style={{ display: 'flex', gap: 4 }}>
                                        <Input maxLength={10} label='Mobile' value={values.mobile} onChangeText={handleChange('mobile')} />
                                        <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.mobile ? errors.mobile : null}</Text>
                                    </View>





                                    <View style={{ gap: 8 }}>
                                        <Text variant="titleMedium" style={{ textAlign: 'center', marginVertical: 0 }}>Property Details</Text>

                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <View style={{ flex: 1 }}>
                                                <Dropdown options={propertyTypeOptions} label="Property Type" value={values.propertyType} onSelect={(propertyType: SelectType) => { setFieldValue('propertyType', propertyType) }} />
                                            </View>
                                        </View>

                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                            <View style={{ flex: 1 }}>
                                                <Dropdown options={zoneOptions} label="Zone" value={values.zone} onSelect={(zone: SelectType) => {
                                                    setFieldValue('zone', zone);
                                                    setFieldValue('ward', "");
                                                    fetchWard(+zone.value);
                                                }} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Dropdown options={wardOptions} label="Ward" value={values.ward} onSelect={(ward: SelectType) => setFieldValue('ward', ward)} />
                                            </View>
                                        </View>


                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <View style={{ flex: 1 }}>
                                                <Dropdown options={mohallaOptions} label="Mohalla Name" value={values.mohallaName} onSelect={(mohallaName: SelectType) => setFieldValue('mohallaName', mohallaName)} />
                                            </View>
                                        </View>

                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <View style={{ flex: 1 }}>
                                                <Dropdown options={categryOptions} label="Category" value={values.category} onSelect={(category: SelectType) => {
                                                    setFieldValue('category', category);
                                                    setFieldValue('subCategory', "");
                                                    fetchSubCategories(+category.value);
                                                }} />
                                            </View>
                                        </View>

                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <View style={{ flex: 1 }}>
                                                <Dropdown options={subCategoryOptions} label="Sub Category " value={values.subCategory} onSelect={(subCategory: SelectType) => setFieldValue('subCategory', subCategory)} />
                                            </View>
                                        </View>

                                        <Button mode='contained' disabled={!isValid} onPress={handleSubmit}>Add Property</Button>

                                    </View>



                                </View>)
                            }
                        </Formik>

                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default FirstForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    }
})