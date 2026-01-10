import { StyleSheet, ScrollView, View, Pressable } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, useTheme, IconButton } from 'react-native-paper';
import PopertyNumberBanner from '../PopertyNumberBanner';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getDemandsOfProperty } from '../../API/service';
import { PropertyContext } from '../../contexts/PropertyContext';
import { AuthContext } from '../../contexts/AuthContext';
import Icon from '@react-native-vector-icons/material-design-icons'

const DemandList = () => {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { property } = useContext(PropertyContext);
    const { user } = useContext(AuthContext);

    const [demands, setDemands] = useState([]);


    const fetchAllDemands = async () => {
        try {
            // console.log('fetch ward ', zoneId)
            const { data } = await getDemandsOfProperty(property?.propertyId || 0, 0, 0);
            console.log(data)
            if (data.code === 200 && data.status === 'Success') {
                setDemands(data.data.demands);
            }
        } catch (error) {
            console.log(error)
        }
    };




    useFocusEffect(useCallback(() => {
        console.log('fetching demand list')
        fetchAllDemands();
        return () => { console.log('Demand list blurred') }
    }, []))



    return (
        <ScrollView style={{ ...styles.container, marginBottom: safeAreaInsets.bottom, backgroundColor: theme.colors.background }}>
            <View style={{ paddingVertical: 8 }}>
                <PopertyNumberBanner />
                <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>All Demands</Text>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text variant='titleMedium' style={{ color: theme.colors.primary, fontWeight: 'bold', textAlign: 'right' }}>Total Due: {12000}</Text>
                </View>

                {/* <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 8 }}>
                    <Pressable onPress={() => navigation.push('ListDemandTxns', { demandId: demand.demandId })}>
                        <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline', fontSize: 12, fontWeight: 'bold' }}>All Transactions</Text>
                    </Pressable>
                </View> */}

                {demands.map((demand, index) => {
                    return (
                        <View key={demand.demandId} style={{ borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 4, }}>
                            <View style={{ paddingHorizontal: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Demand No. : {demand?.demandNo === '' ? 'Not Generated' : demand?.demandNo}</Text>
                                        <Text variant='bodySmall' style={{}}>Financial Year: {demand.fyName}</Text>
                                    </View>
                                    <IconButton mode='text' icon={() => <Icon name='format-list-text' size={20} color={theme.colors.primary} />}
                                        onPress={() => navigation.push('ListDemandTxns', { demandId: demand.demandId })} />
                                </View>


                                <View style={{ marginTop: 8 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text variant='titleSmall' style={{ flex: 2, textAlign: 'right' }}>Previous Due :</Text>
                                        <Text variant='titleSmall' style={{ flex: 1, textAlign: 'right' }}> {demand.dueFromPrevYear}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text variant='titleSmall' style={{ flex: 2, textAlign: 'right' }}>Current Due :</Text>
                                        <Text variant='titleSmall' style={{ flex: 1, textAlign: 'right' }}> {demand.currentFyAmount}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                        <Text variant='titleSmall' style={{ flex: 2, paddingTop: 4, textAlign: 'right' }}>Total:</Text>
                                        <Text variant='titleSmall' style={{ flex: 1, paddingTop: 4, textAlign: 'right', borderTopColor: theme.colors.primary, borderTopWidth: 1 }}>{demand.totalAmount}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                        <Text variant='titleSmall' style={{ flex: 2, paddingTop: 4, textAlign: 'right' }}>Amount Paid by today:</Text>
                                        <Text variant='titleSmall' style={{ flex: 1, paddingTop: 4, textAlign: 'right' }}>{demand.amountPaid}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                        <Text variant='titleSmall' style={{ flex: 2, paddingTop: 4, textAlign: 'right' }}>Amount Pending:</Text>
                                        <Text variant='titleSmall' style={{ flex: 1, paddingTop: 4, textAlign: 'right', borderTopColor: theme.colors.primary, borderTopWidth: 1 }}>{demand.amountPending}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 2, marginTop: 8 }}>
                                <Pressable style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.primary }}
                                    onPress={() => navigation.push('ViewDemandPdf', { demandId: demand.demandId })}>
                                    <Text variant='titleSmall' style={{ color: theme.colors.onPrimary }}>View Demand</Text>
                                </Pressable>
                                <Pressable style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.primary }}
                                    onPress={() => navigation.push('PaymentCollection', { demandId: demand.demandId, amountPending: demand.amountPending })}>
                                    <Text variant='titleSmall' style={{ color: theme.colors.onPrimary }}>Payment</Text>
                                </Pressable>
                                {/* <Pressable style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.primary }}
                                    onPress={() => navigation.push('PaymentCollection', { demandId: demand.demandId, amountPending: demand.amountPending })}>
                                    <Text variant='titleSmall' style={{ color: theme.colors.onPrimary }}>Generate Demand</Text>
                                </Pressable> */}
                            </View>
                        </View>
                    )
                })}


            </View>

        </ScrollView>
    )
}

export default DemandList

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 8 }
})