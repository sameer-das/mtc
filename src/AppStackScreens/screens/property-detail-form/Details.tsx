import { StyleSheet, Text, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { SelectType } from '../../../Models/models';
import { Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PropertyDetailType {
    zone: SelectType | null,
    ward: SelectType | null,
    mohallaName: SelectType | null,

    category: SelectType | null,
    subCategroy: SelectType | null,

    propertyType: SelectType | null,
    typeOfOwnerShip: SelectType | null,
    widthOfRoad: string,
    area: string
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
        area: ''
    });

    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();

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
        { label: 'Category 1', value: 'value1' },
        { label: 'Category 2', value: 'value2' },
        { label: 'Category 3', value: 'value3' },
    ]);
    const [subCategoryOptions, setSubCategoryOptions] = useState<SelectType[]>([
        { label: 'Sub Category 1', value: 'value1' },
        { label: 'Sub Category 2', value: 'value2' },
        { label: 'Sub Category 3', value: 'value3' },
    ]);
    const [mohallaOptions, setMohallaOptions] = useState<SelectType[]>([
        { label: 'Mohalla 1', value: 'value1' },
        { label: 'Mohalla 2', value: 'value2' },
        { label: 'Mohalla 3', value: 'value3' },
    ]);
    const [propertyTypeOptions, setPropertyTypeOptions] = useState<SelectType[]>([
        { label: 'Property Type 1', value: 'value1' },
        { label: 'Property Type 2', value: 'value2' },
        { label: 'Property Type 3', value: 'value3' },
    ]);
    const [ownershipTypeOptions, setOwnershipTypeOptions] = useState<SelectType[]>([
        { label: 'Ownership Type 1', value: 'value1' },
        { label: 'Ownership Type 2', value: 'value2' },
        { label: 'Ownership Type 3', value: 'value3' },
    ]);

    return (
        <ScrollView style={{ flexGrow: 1 }}>
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => console.log(values)}>
                {
                    ({ values, errors, handleSubmit, handleChange, setFieldValue, isValid }) => {
                        return (<View style={{ display: 'flex', gap: 12, marginBottom: safeAreaInsets.bottom + 80 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={zoneOptions} label="Zone" value={values.zone} onSelect={(zone: SelectType) => setFieldValue('zone', zone)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={wardOptions} label="Ward" value={values.ward} onSelect={(ward: SelectType) => setFieldValue('ward', ward)} />
                                </View>
                            </View>
                            <View>
                                <Dropdown options={mohallaOptions} label="Mohalla Name" value={values.mohallaName} onSelect={(mohallaName: SelectType) => setFieldValue('mohallaName', mohallaName)} />
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={categryOptions} label="Category" value={values.category} onSelect={(category: SelectType) => setFieldValue('category', category)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={subCategoryOptions} label="Sub Category " value={values.subCategroy} onSelect={(subCategory: SelectType) => setFieldValue('subCategory', subCategory)} />
                                </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={propertyTypeOptions} label="Property Type" value={values.propertyType} onSelect={(propertyType: SelectType) => setFieldValue('propertyType', propertyType)} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Dropdown options={ownershipTypeOptions} label="Type of Ownership " value={values.typeOfOwnerShip} onSelect={(typeOfOwnerShip: SelectType) => setFieldValue('typeOfOwnerShip', typeOfOwnerShip)} />
                                </View>
                            </View>

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
                                <View style={{ display: 'flex', height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 0 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.widthOfRoad ? errors.widthOfRoad : null}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: theme.colors.error, fontSize: 12 }}>{errors.area ? errors.area : null}</Text>
                                    </View>
                                </View>
                            </View>

                            <Button style={{ marginTop: 8 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Property Details</Button>

                        </View>)
                    }
                }
            </Formik>
        </ScrollView>
    )
}

export default Details

const styles = StyleSheet.create({})