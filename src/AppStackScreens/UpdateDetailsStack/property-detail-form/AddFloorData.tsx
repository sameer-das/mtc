import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'

import { Button, Text, useTheme } from 'react-native-paper';
import PopertyNumberBanner from '../../PopertyNumberBanner';
import Input from '../../../components/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddFloorData = () => {

    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const [noOfFloor, setNoOfFloor] = useState(1);
    const [formData, setFormData] = useState<{ floorData: string }[]>([]);


    const handleNoOfFloorChange = (value: string) => {
        const count = parseInt(value, 10) || 0;
        setNoOfFloor(count);

        const initialRows = Array.from({ length: count }, () => ({
            floorData: ''
        }));
        setFormData(initialRows);
    }



    const handleInputChange = (index: number, value: string) => {
        const updatedData = [...formData];
        updatedData[index].floorData = value;
        setFormData(updatedData);
    };

    return (
        <ScrollView style={{ flexGrow: 1, backgroundColor: theme.colors.background }}>

            <View style={{ ...styles.container, marginBottom: safeAreaInsets.bottom }}>
                <View style={{width: '100%'}}>
                    <PopertyNumberBanner />
                </View>
                <Text variant="titleMedium">Update Floor Data</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                    <View style={{ flex: 1 }}>
                        <Input value={noOfFloor}
                            label="No Of Floors"
                            onChangeText={(value: string) => handleNoOfFloorChange(value)} />
                    </View>

                </View>
                
                <View style={{ width: '100%', marginTop: 8}}>
                    <Text variant='bodySmall' style={{ textAlign: 'left', width: '100%' }}>Please enter the number of floors the building has. </Text>
                    <Text variant='bodySmall' style={{ textAlign: 'left', width: '100%' }}>Please specify the floor details in respective field. </Text>

                </View>


                <View style={{ marginTop: 32, width: '100%', gap: 12, }}>

                    {formData.map((current, index) => {
                        return (<View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                            <View style={{ flex: 1 }}>
                                <Input value={current.floorData}
                                    label={`Floor No. ${index}`}
                                    onChangeText={(value: string) => handleInputChange(index, value)} />
                            </View>
                        </View>)
                    })}
                </View>


                <Button mode='contained' style={{ width: '100%', marginTop: 16 }}> Update Floor Data </Button>

            </View>
        </ScrollView>
    )
}

export default AddFloorData

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
    }
})