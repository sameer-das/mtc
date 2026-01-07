import { StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import { PropertyContext } from '../../contexts/PropertyContext';
import { getOwnerDetails } from '../../API/service';
import { useFocusEffect } from '@react-navigation/native';
import PopertyNumberBanner from './PopertyNumberBanner';

const AfterPropertySearchMenu = ({ navigation }) => {
    const theme = useTheme();
    const { property } = useContext(PropertyContext);
    const [owner, setOwner] = useState({});

    const fetchOwnerDetails = async (ownerId: number) => {
        const resp = await getOwnerDetails(ownerId);
        if (resp.data.code === 200 && resp.data.status === 'Success') {
            setOwner(resp.data.data)
        } else {
            setOwner({})
        }
    }

    useFocusEffect(useCallback(() => {
        fetchOwnerDetails(property?.ownerId || 0);
        return () => { console.log('AfterPropertySearchMenu blurred') }
    }, []))

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <PopertyNumberBanner />
            <Text variant='headlineSmall' style={{ textAlign: 'center', marginBottom: 12 }}>Owner Details</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Owner Name : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{owner?.salutation || ''} {owner?.ownerName || property?.ownerName || 'Not Updated'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>{owner.careOf || 'C/o'}</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{owner?.guardianName ||  'Not Updated'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Gender</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{owner?.gender || 'Not Updated'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Mobile</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{owner?.mobile || 'Not Updated'}</Text>
            </View>
            
            <View style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                <Button mode="contained" onPress={() => { navigation.push('UpdateDetailsStack') }}>View/Update Details</Button>
                <Button mode="contained" onPress={() => { navigation.push('AadharAndPan') }}>Update Aadhar/Pan Details</Button>
                <Button mode="contained" onPress={() => { navigation.push('DemandGeneration') }}>Generate Demand</Button>
                <Button mode="contained" onPress={() => { navigation.push('PaymentCollection') }}>Payment Collection</Button>
            </View>
            <View style={{ marginTop: 12 }}>
                {/* <Button mode="outlined" onPress={() => { navigation.replace('Search') }}>Search another property</Button> */}
            </View>
        </View>
    )
}

export default AfterPropertySearchMenu

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
})