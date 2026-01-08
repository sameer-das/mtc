import { StyleSheet, Text, ScrollView, View, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { PropertyMaster, SelectType } from '../../../Models/models';
import { Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { getCategories, getMohallaList, getPropertyType, getSubCategoriesOfCategory, getWardList, getZoneList, updatePropertyMaster } from '../../../API/service';
import { PropertyContext } from '../../../contexts/PropertyContext';
import Loading from '../../../components/Loading';
import { AuthContext } from '../../../contexts/AuthContext';

interface PropertyDetailType {
    zone: SelectType | null,
    ward: SelectType | null,
    mohallaName: SelectType | null,

    category: SelectType | null,
    subCategory: SelectType | null,

    propertyType: SelectType | null,
    typeOfOwnerShip: SelectType | null,
    widthOfRoad: string | null,
    area: string | null,

    appartmentBuildingNo: string | null,
    appartmentFlatNo: string | null,
}

const validationSchema = Yup.object().shape({
    widthOfRoad: Yup.string().matches(/^[0-9]+$/, 'Only digits are allowed'),
    area: Yup.string().matches(/^[0-9]+$/, 'Only digits are allowed'),
})


const Details = () => {
    const { property } = useContext(PropertyContext);
    const { user } = useContext(AuthContext);

    const [ownershipTypeOptions, setOwnershipTypeOptions] = useState<SelectType[]>([
        { label: 'Individual Building', value: '1' },
        { label: 'Flat in Appartment', value: '2' },
        { label: 'Others', value: '3' },
    ]);

    const selectedOwnerShipType = ownershipTypeOptions.find((c) => c.value == property?.typeOfOwnership) || null;


    const [initialValues, setInitialValues] = useState<PropertyDetailType>({
        zone: null,
        ward: null,
        mohallaName: null,

        category: null,
        subCategory: null,

        propertyType: null,
        typeOfOwnerShip: selectedOwnerShipType || null,
        widthOfRoad: property?.widthOfRoad || null,
        area: property?.areaOfPlot || null,

        appartmentBuildingNo: property?.buildingNo || null,
        appartmentFlatNo: property?.flatNo || null,
    });

    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const navigation = useNavigation();


    const [zoneOptions, setZoneOptions] = useState<SelectType[]>([]);
    const [wardOptions, setWardOptions] = useState<SelectType[]>([]);

    const [categryOptions, setCategoryOptions] = useState<SelectType[]>([
        { label: 'School / Collage', value: 'value1' },
        { label: 'Shop / Tea Stall', value: 'value2' },
        { label: 'Restaurant', value: 'value3' },
    ]);
    const [subCategoryOptions, setSubCategoryOptions] = useState<SelectType[]>([
        { label: '100 to 999 SQ MTR', value: 'value1' },
        { label: '1000 to 1999 SQ MTR', value: 'value2' },
        { label: 'Sub Category 3', value: 'value3' },
    ]);
    const [mohallaOptions, setMohallaOptions] = useState<SelectType[]>([
        { label: 'Mohalla 1', value: 'value1' },
        { label: 'Mohalla 2', value: 'value2' },
        { label: 'Mohalla 3', value: 'value3' },
    ]);
    const [propertyTypeOptions, setPropertyTypeOptions] = useState<SelectType[]>([
        { label: 'Residential (R)', value: '1' },
        { label: 'Commercial (C)', value: '2' },
        { label: 'Mix (M)', value: '3' },
        { label: 'Vacant Land (P)', value: '4' },
    ]);


    const [isIndividualBuilding, setIsIndividualBuilding] = useState(selectedOwnerShipType?.value === '1' ? true : false);
    const [isFlat, setIsFlat] = useState(selectedOwnerShipType?.value === '2' ? true : false);

    const [loading, setLoading] = useState(false);





    const fetchWard = async (zoneId: number) => {
        try {
            // console.log('fetch ward ', zoneId)
            const { data } = await getWardList(zoneId, 0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setWardOptions(data.data.wards.map(cur => ({ label: cur.wardNumber, value: cur.wardId })))
                const ind = data.data.wards.findIndex(c => c.wardId === property?.ward);
                // console.log(ind)
                if (ind >= 0) {
                    setInitialValues((prev) => {
                        return { ...prev, ward: { label: data.data.wards[ind].wardNumber, value: data.data.wards[ind].wardId } }
                    });
                }
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
                const ind = data.data.zones.findIndex(c => c.zoneId === property?.zone);
                // console.log(ind)
                if (ind >= 0) {
                    setInitialValues((prev) => {
                        return { ...prev, zone: { label: data.data.zones[ind].zoneName, value: data.data.zones[ind].zoneId } }
                    });
                    fetchWard(data.data.zones[ind].zoneId)
                }
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
                const ind = data.data.mohallas.findIndex(c => c.mohallaId === (property?.mohallaName ? +property?.mohallaName : 0));
                // console.log(ind)
                if (ind >= 0) {
                    setInitialValues((prev) => {
                        return { ...prev, mohallaName: { label: data.data.mohallas[ind].mohallaName, value: data.data.mohallas[ind].mohallaId } }
                    });
                }
            }

        } catch (error) {

        }
    }



    const fetchSubCategories = async (categoryId: number) => {
        try {
            // console.log('fetch sub cat ', categoryId)
            const { data } = await getSubCategoriesOfCategory(categoryId, 0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setSubCategoryOptions(data.data.subCategories.map(cur => ({ label: cur.subCategoryName, value: cur.subCategoryId })))
                const ind = data.data.subCategories.findIndex(c => c.subCategoryId === (property?.subcategory ? +property.subcategory : 0));
                // console.log(ind)
                if (ind >= 0) {
                    setInitialValues((prev) => {
                        return { ...prev, subCategory: { label: data.data.subCategories[ind].subCategoryName, value: data.data.subCategories[ind].subCategoryId } }
                    });
                }
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
                const ind = data.data.categories.findIndex(c => c.categoryId === (property?.category ? +property.category : 0) );
                // console.log(property?.propertyType)
                // console.log(ind)
                if (ind >= 0) {
                    setInitialValues((prev) => {
                        return { ...prev, category: { label: data.data.categories[ind].categoryName, value: data.data.categories[ind].categoryId } }
                    });
                    fetchSubCategories(data.data.categories[ind].categoryId)
                }
            }

        } catch (error) {

        }
    }



    const fetchPropertyType = async () => {
        try {
            const { data } = await getPropertyType(0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setPropertyTypeOptions(data.data.propertyTypes.map(cur => ({ label: cur.propertyTypeName, value: cur.propertyTypeName })));
                const ind = data.data.propertyTypes.findIndex(c => c.propertyTypeName === property?.propertyType );
                // console.log(property?.category)
                // console.log(ind)
                if (ind >= 0) {
                    setInitialValues((prev) => {
                        return { ...prev, propertyType: { label: data.data.propertyTypes[ind].propertyTypeName, value: data.data.propertyTypes[ind].propertyTypeName } }
                    });
                }
            }

        } catch (error) {

        }
    }

    




    useEffect(() => {
        fetchZones();
        fetchMohalla();
        fetchCategories();
        fetchPropertyType();
    }, []);



    const updateDetails = async (values: PropertyDetailType) => {
        const updateDetailsPayload: PropertyMaster = {
            householdNo: property?.householdNo,
            zone: values.zone?.value,
            ward: values.ward?.value,
            category: property?.category,
            subcategory: property?.subcategory,
            mohallaName: property?.mohallaName,
            propertyType: property?.propertyType,
            typeOfOwnership: values.typeOfOwnerShip?.value,
            widthOfRoad: values.widthOfRoad,
            areaOfPlot: values.area,

            buildingNo: values.appartmentBuildingNo,
            flatNo: values.appartmentFlatNo,
            updatedBy: user.username
        };

        try {
            setLoading(true)
            const resp = await updatePropertyMaster(updateDetailsPayload);

            if (resp.data.code === 200 && resp.data.status === 'Success') {
                Alert.alert('Success', 'Property details updated successfully')
            } else {
                Alert.alert('Fail', 'Failed while updating property details.')
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Error while updating property details.')
        } finally {
            setLoading(false)
        }
    }





    const handleTypeChange = (type: SelectType | null) => {
        if (type?.value === '1') {
            setIsIndividualBuilding(true);
            setIsFlat(false)
        } else if (type?.value === '2') {
            setIsIndividualBuilding(false);
            setIsFlat(true);
        } else {
            setIsIndividualBuilding(false);
            setIsFlat(false);
        }
    }


    return (
        <ScrollView style={{ flexGrow: 1 }}>
            <Loading visible={loading} />
            <Formik initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values) => updateDetails(values)}>
                {
                    ({ values, errors, handleSubmit, handleChange, setFieldValue, isValid }) => {
                        return (<View style={{ display: 'flex', gap: 12, marginBottom: safeAreaInsets.bottom + 80 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={zoneOptions} label="Zone" value={values.zone} onSelect={(zone: SelectType) => {
                                        setFieldValue('zone', zone);
                                        fetchWard(+zone.value);
                                    }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={wardOptions} label="Ward" value={values.ward} onSelect={(ward: SelectType) => setFieldValue('ward', ward)} />
                                </View>
                            </View>
                            <View>
                                <Dropdown options={mohallaOptions} label="Mohalla Name" value={values.mohallaName} onSelect={(mohallaName: SelectType) => setFieldValue('mohallaName', mohallaName)} />
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={categryOptions} label="Category" value={values.category} onSelect={(category: SelectType) => {
                                        setFieldValue('category', category);
                                        setFieldValue('subCategory', {});
                                        fetchSubCategories(+category.value);
                                        }} />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={subCategoryOptions} label="Sub Category " value={values.subCategory} onSelect={(subCategory: SelectType) => setFieldValue('subCategory', subCategory)} />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={propertyTypeOptions} label="Property Type" value={values.propertyType} onSelect={(propertyType: SelectType) => { setFieldValue('propertyType', propertyType) }} />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={ownershipTypeOptions} label="Type" value={values.typeOfOwnerShip} onSelect={(typeOfOwnerShip: SelectType) => { handleTypeChange(typeOfOwnerShip); setFieldValue('typeOfOwnerShip', typeOfOwnerShip) }} />
                                </View>
                            </View>



                            {isFlat && <View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                    <View style={{ flex: 1 }}>
                                        <Input label='Building No.' value={values.appartmentBuildingNo} onChangeText={handleChange('appartmentBuildingNo')} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Input label='Flat No.' value={values.appartmentFlatNo} onChangeText={handleChange('appartmentFlatNo')} />
                                    </View>
                                    {/* <View style={{ flex: 1 }}>
                                        <Input label='Area of Flat (Sq. Ft.)' value={values.appartmentFlatArea} onChangeText={handleChange('appartmentFlatArea')} />
                                    </View> */}
                                </View>
                            </View>

                            }

                            {isIndividualBuilding && <View>
                                {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'  }}>
                                    <View style={{ flex: 1 }}>
                                        <Input label='No. of floors the building has' value={values.noOfFloor} onChangeText={(v: string) => {handleNoOfFloorChange(v); handleChange('noOfFloor')(v)}} />
                                    </View>                                    
                                </View> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', }}>
                                    <Button style={{ flex: 1 }}
                                        mode='outlined'
                                        onPress={() => navigation.push('AddFloorData')}
                                        icon={() => <Icon name='domain-plus' color={theme.colors.primary} size={20} />}> Add/View floor wise data</Button>
                                </View>
                            </View>

                            }

                            <View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                    <View style={{ flex: 1 }}>
                                        <Input label='Width of road sorrounding (Ft)' value={values.widthOfRoad} onChangeText={handleChange('widthOfRoad')} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Input label='Area (Sq. Ft)' value={values.area} onChangeText={handleChange('area')} />
                                    </View>
                                </View>

                                {/* For Validation Error Text */}
                                {/* <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 0 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.widthOfRoad ? errors.widthOfRoad : null}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.area ? errors.area : null}</Text>
                                    </View>
                                </View> */}
                            </View>

                            <Button style={{ marginTop: 20 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Details</Button>

                        </View>)
                    }
                }
            </Formik>
        </ScrollView>
    )
}

export default Details

const styles = StyleSheet.create({})