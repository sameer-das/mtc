import { StyleSheet, Text, ScrollView, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { SelectType } from '../../../Models/models';
import { Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { getWardList, getZoneList } from '../../../API/service';
import { PropertyContext } from '../../../contexts/PropertyContext';

interface PropertyDetailType {
    zone: SelectType | null,
    ward: SelectType | null,
    mohallaName: SelectType | null,

    category: SelectType | null,
    subCategroy: SelectType | null,

    propertyType: SelectType | null,
    typeOfOwnerShip: SelectType | null,
    widthOfRoad: string,
    area: string,

    appartmentBuildingNo: string,
    appartmentFlatNo: string,
    appartmentFlatArea: string,

    noOfFloor: string,
}

const validationSchema = Yup.object().shape({
    widthOfRoad: Yup.string().matches(/^[0-9]+$/, 'Only digits are allowed'),
    area: Yup.string().matches(/^[0-9]+$/, 'Only digits are allowed'),
})


const Details = () => {
    const [initialValues, setInitialValues] = useState<PropertyDetailType>({
        zone: null,
        ward: null,
        mohallaName: null,

        category: null,
        subCategroy: null,

        propertyType: null,
        typeOfOwnerShip: null,
        widthOfRoad: '',
        area: '',

        appartmentBuildingNo: '',
        appartmentFlatNo: '',
        appartmentFlatArea: '',
        noOfFloor: ''
    });

    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { property } = useContext(PropertyContext)

    const [zoneOptions, setZoneOptions] = useState<SelectType[]>([
        { label: 'Zone 1', value: 'value1' },
        { label: 'Zone 2', value: 'value2' },
        { label: 'Zone 3', value: 'value3' },
    ]);
    const [wardOptions, setWardOptions] = useState<SelectType[]>([
        { label: 'Ward 1', value: 'value1' },
        { label: 'Ward 2', value: 'value2' },
        { label: 'Ward 3', value: 'value3' },
    ]);
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
    const [ownershipTypeOptions, setOwnershipTypeOptions] = useState<SelectType[]>([
        { label: 'Individual Building', value: '1' },
        { label: 'Flat in Appartment', value: '2' },
        { label: 'Others', value: '3' },
    ]);

    const [isIndividualBuilding, setIsIndividualBuilding] = useState(false);
    const [isFlat, setIsFlat] = useState(false);



    const fetchWard = async (zoneId: number) => {
        try {
            // console.log('fetch ward ', zoneId)
            const { data } = await getWardList(zoneId, 0, 0);
            // console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setZoneOptions(data.data.wards.map(cur => ({ label: cur.wardNumber, value: cur.wardId })))
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


    

    useEffect(() => {
        fetchZones()
    }, [])





    const handleTypeChange = (type: SelectType) => {
        if (type.value === '1') {
            setIsIndividualBuilding(true);
            setIsFlat(false)
        } else if (type.value === '2') {
            setIsIndividualBuilding(false);
            setIsFlat(true);
        } else {
            setIsIndividualBuilding(false);
            setIsFlat(false);
        }
    }


    return (
        <ScrollView style={{ flexGrow: 1 }}>
            <Formik initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values) => console.log(values)}>
                {
                    ({ values, errors, handleSubmit, handleChange, setFieldValue, isValid }) => {
                        return (<View style={{ display: 'flex', gap: 12, marginBottom: safeAreaInsets.bottom + 80 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={zoneOptions} label="Zone" value={values.zone} onSelect={(zone: SelectType) => {
                                        setFieldValue('zone', zone);
                                        fetchWard(+zone.value)
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
                                    <Dropdown options={categryOptions} label="Category" value={values.category} onSelect={(category: SelectType) => setFieldValue('category', category)} />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={subCategoryOptions} label="Sub Category " value={values.subCategroy} onSelect={(subCategory: SelectType) => setFieldValue('subCategory', subCategory)} />
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
                                    <View style={{ flex: 1 }}>
                                        <Input label='Area of Flat (Sq. Ft.)' value={values.appartmentFlatArea} onChangeText={handleChange('appartmentFlatArea')} />
                                    </View>
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
                                        onPress={() => navigation.push('addFloorData')}
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
                                        <Input label='Area (Sq. Meters)' value={values.area} onChangeText={handleChange('area')} />
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