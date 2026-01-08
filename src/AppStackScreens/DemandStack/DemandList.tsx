import { StyleSheet, ScrollView, View, Pressable } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import PopertyNumberBanner from '../PopertyNumberBanner';
import { useNavigation } from '@react-navigation/native';

const DemandList = () => {
    const theme = useTheme();
    const safeAreaInsets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <ScrollView style={{ ...styles.container, marginBottom: safeAreaInsets.bottom, backgroundColor: theme.colors.background }}>
            <View style={{ paddingVertical: 8 }}>
                <PopertyNumberBanner />
                <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>All Demands</Text>
                <View>
                    <Text variant='titleMedium' style={{ color: theme.colors.primary, fontWeight: 'bold', textAlign: 'right' }}>Total Due: {12000}</Text>
                </View>


                <View style={{ borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 4, marginTop: 16 }}>
                    <View style={{ paddingHorizontal: 8 }}>
                        <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Demand No. : {12596364656}</Text>
                        <Text variant='bodySmall' style={{}}>Financial Year: FY25-26</Text>

                        <View style={{ marginTop: 8 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text variant='titleSmall' style={{ flex: 2, textAlign: 'right' }}>Previous Due :</Text>
                                <Text variant='titleSmall' style={{ flex: 1, textAlign: 'right' }}> {'2000.00'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text variant='titleSmall' style={{ flex: 2, textAlign: 'right' }}>Current Due :</Text>
                                <Text variant='titleSmall' style={{ flex: 1, textAlign: 'right' }}> {'3000.00'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                <Text variant='titleSmall' style={{ flex: 2, paddingTop: 4, textAlign: 'right' }}>Total:</Text>
                                <Text variant='titleSmall' style={{ flex: 1, paddingTop: 4, textAlign: 'right', borderTopColor: theme.colors.primary, borderTopWidth: 1 }}>{'5000.00'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 8 }}>
                        <Pressable style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.primary }}
                            onPress={() => navigation.push('ViewDemand')}>
                            <Text variant='titleSmall' style={{ color: theme.colors.onPrimary }}>View Demand</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.primary }}
                            onPress={() => navigation.push('PaymentCollection')}>
                            <Text variant='titleSmall' style={{ color: theme.colors.onPrimary }}>Payment</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ borderColor: theme.colors.primary, borderWidth: 1, borderRadius: 4, marginTop: 16 }}>
                    <View style={{ paddingHorizontal: 8 }}>
                        <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Demand No. : {'Not Generated'}</Text>
                        <Text variant='bodySmall' style={{}}>Financial Year: FY24-25</Text>

                        <View style={{ marginTop: 8 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text variant='titleSmall' style={{ flex: 2, textAlign: 'right' }}>Previous Due :</Text>
                                <Text variant='titleSmall' style={{ flex: 1, textAlign: 'right' }}> {'2000.00'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text variant='titleSmall' style={{ flex: 2, textAlign: 'right' }}>Current Due :</Text>
                                <Text variant='titleSmall' style={{ flex: 1, textAlign: 'right' }}> {'5000.00'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                <Text variant='titleSmall' style={{ flex: 2, paddingTop: 4, textAlign: 'right' }}>Total:</Text>
                                <Text variant='titleSmall' style={{ flex: 1, paddingTop: 4, textAlign: 'right', borderTopColor: theme.colors.primary, borderTopWidth: 1 }}>{'7000.00'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 8 }}>
                        <Pressable style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.primary }}>
                            <Text variant='titleSmall' style={{ color: theme.colors.onPrimary }}>Generate Demand</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

        </ScrollView>
    )
}

export default DemandList

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 8 }
})