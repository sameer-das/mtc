import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Divider, IconButton, Menu, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PropertyContext } from '../contexts/PropertyContext';
import PopertyNumberBanner from './PopertyNumberBanner';
import { AuthContext } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import { ApproveRejectPayload } from '../Models/models';
import { approveRejectProperty } from '../API/service';

const AfterPropertySearchMenu = () => {
    const theme = useTheme();
    const { property } = useContext(PropertyContext);
    const { user } = useContext(AuthContext);
    const safeAreaInsets = useSafeAreaInsets();
    const navigation = useNavigation();


    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(useCallback(() => {
        return () => { console.log('AfterPropertySearchMenu blurred') }
    }, []));


    const callApproveAPI = async () => {
        try {
            setIsLoading(true);
            const payload: ApproveRejectPayload = {
                logId: Number(property?.attribute2 || 0),
                comments: '',
                status: 'Approved',
                approverUserId: user.id,
                propertyId: Number(property?.propertyId || 0)
            }
            const { data } = await approveRejectProperty(payload);
            console.log(data);
            if (data.status === 'Success' && data.code === 200) {
                Alert.alert('Success', 'Property is approved successfully.');
            } else {
                Alert.alert('Fail', 'Property approval failed.');

            }
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Property approval failed with error.');
        } finally {
            setIsLoading(false);
        }
    }


    const approveProperty = () => {
        Alert.alert('Did you verify?', 'Please verify the property details. Your approval will be forwarded to your reporting manager for review. Are you sure you want to approve?', [{
            text: 'Approve',
            onPress: async () => { await callApproveAPI() }
        },
        {
            text: 'Cancel',
            onPress: () => { }
        }
        ])
    }



    const MenuOptions = () => {
        const containerStyle: ViewStyle = {
            backgroundColor: theme.colors.surfaceVariant,
            marginHorizontal: 16,
            borderRadius: 8,
            justifyContent: 'flex-start',
            padding: 8
        };
        return (<Portal>
            <Modal visible={visible} onDismiss={closeMenu} contentContainerStyle={containerStyle}>
                <Text variant='headlineSmall' style={{ textAlign: 'center', marginVertical: 8 }} >Property Options</Text>
                <View style={{ display: 'flex', gap: 12, marginVertical: 20 }}>
                    <Button mode="contained" onPress={() => { closeMenu(); navigation.push('UpdateDetailsStack') }}>Update Property Details</Button>
                    <Button mode="contained" onPress={() => { closeMenu(); navigation.push('AadharAndPan') }}>Update Aadhar/Pan Details</Button>
                    <Button mode="contained" onPress={() => { closeMenu(); navigation.push('DemandStack') }}>Demands/Transactions</Button>
                    <Button mode="contained" onPress={() => { closeMenu(); navigation.push('ApprovalHistory') }}>Approval History</Button>
                    {user.id === Number(property?.attribute1 || 0) && <Button mode="contained" onPress={() => { closeMenu(); approveProperty() }}>Approve Property</Button>}
                    {/* <Button mode="outlined" onPress={() => { navigation.replace('Search') }}>G</Button> */}

                </View>

            </Modal>
        </Portal>)
    }



    return (
        <ScrollView style={{ ...styles.container, backgroundColor: theme.colors.background, }}>

            <PopertyNumberBanner />
            <Loading visible={isLoading} />
            <MenuOptions />

            {/* Owner Details */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IconButton icon='dots-horizontal' onPress={openMenu} />
            </View>
            <Text variant='titleLarge' style={{ color: theme.colors.primary, fontSize: 20 }}>Owner Details</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Owner Name : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{property?.salutation || ''} {property?.ownerName || 'Not Updated'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>{property?.careOf || 'C/o'} :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.guardianName || 'Not Updated'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Gender :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.gender || 'Not Updated'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Mobile :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.mobile || property?.attribute5 || 'Not Updated'}</Text>
            </View>


            {/* Approval Status */}
            <Text variant='titleLarge' style={{ color: theme.colors.primary, marginTop: 8, fontSize: 20 }}>Approval Details</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Status : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{property?.attribute0 || '--'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Approver Name : </Text>
                {property?.approverName && <Text variant='titleSmall' style={{ width: '50%' }}>{property?.approverName || '-'} ({property?.approverUserTypeName})</Text>}
            </View>
            {property?.approverName && <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>{''}</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>Mobile: {property?.approverName}, Email: {property?.approverEmail}</Text>
            </View>}



            {/* Property Details */}
            <Text variant='titleLarge' style={{ color: theme.colors.primary, marginTop: 8, fontSize: 20 }}>Property Details</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Property Type : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{property?.propertyType || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Zone : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{property?.zoneName || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Ward : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{property?.wardName || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Mohalla Name : </Text>
                <Text variant='titleSmall' style={{ width: '50%', color: theme.colors.primary, fontWeight: 'bold' }}>{property?.mohallaNameDetail || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Category :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.categoryName || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Sub Category :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.subCategoryName || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Area (Sq. Ft.) :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.plotArea || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Width of Road (Ft.) :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.widthOfRoad || '-'}</Text>
            </View>


            {/* Property Address */}
            <Text variant='titleLarge' style={{ color: theme.colors.primary, marginTop: 8, fontSize: 20 }}>Property Address</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>House No :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.propertyAddressHouseNo || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Address :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.propertyAddress || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>{''}</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.propertyAddressDistrict} {property?.propertyAddressCity}, {property?.propertyAddressPin}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Land Mark :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.propertyAddressLandmark || '-'}</Text>
            </View>


            {/* Owner Address */}
            <Text variant='titleLarge' style={{ color: theme.colors.primary, marginTop: 8, fontSize: 20 }}>Owner Address</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>House No :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.ownerAddressHouseNo || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Address :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.ownerAddress || '-'}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>{''}</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.ownerAddressDistrict} {property?.ownerAddressCity}, {property?.ownerAddressPin}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', paddingBottom: safeAreaInsets.bottom + 50 }}>
                <Text variant='titleMedium' style={{ width: '50%' }}>Land Mark :</Text>
                <Text variant='titleSmall' style={{ width: '50%' }}>{property?.ownerAddressLandmark || '-'}</Text>
            </View>

        </ScrollView>
    )
}

export default AfterPropertySearchMenu

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
})