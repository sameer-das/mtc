import React, { useContext, useEffect, useState } from 'react'
import { Alert, PermissionsAndroid, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import Datepicker from '../../components/Datepicker'
import Dropdown from '../../components/Dropdown'
import Input from '../../components/Input'
import { PropertyContext } from '../../contexts/PropertyContext'
import { AddDemandTxnType, SelectType } from '../../Models/models'
import PopertyNumberBanner from '../PopertyNumberBanner'
import CustomImagePicker from '../../components/CustomImagePicker'
import Icon from '@react-native-vector-icons/material-design-icons'
import Geolocation from '@react-native-community/geolocation'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthContext } from '../../contexts/AuthContext'
import { addDemandTransaction } from '../../API/service'
import { TRANSACTION_REMARKS } from '../../constants/constants'

const getDate = (date: Date | string) => {
  const d = new Date(date).getTime() + 19800000;
  return new Date(d).toISOString();
}

const PaymentCollection = () => {
  const { property } = useContext(PropertyContext)
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const route = useRoute();

  const [remarkOptions, setRemarkOptions] = useState<SelectType[]>(TRANSACTION_REMARKS);

  const [remark, setRemark] = useState<SelectType>();
  const [amount, setAmount] = useState('0');
  const [nextVisitDate, setNextVisitDate] = useState<Date>(new Date());
  const [otherReason, setOtherReason] = useState('');
  const [trasactionNo, setTransactionNo] = useState('');
  const [image, setImage] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  const [disableAmount, setDisableAmount] = useState(true);
  const [disableTransactionNo, setDisableTransactionNo] = useState(true);
  const [showNextVisitDate, setShowNextVisitDate] = useState(false);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [hideAmountTxn, setHideAmountTxn] = useState(true);

  const [isLocationFetching, setIsLocationFetching] = useState(false)


  useEffect(() => {
    console.log(remark);
    if (remark?.value === 1) {
      setDisableAmount(true);
      setAmount(String(route.params.amountPending || 0));
      setDisableTransactionNo(false);
      setShowCustomReason(false);
      setShowNextVisitDate(false);
      setHideAmountTxn(false);
      setOtherReason('');
    } else if (remark?.value === 2) {
      setAmount('0');
      setDisableTransactionNo(false);
      setDisableAmount(false);
      setShowCustomReason(false);
      setShowNextVisitDate(false);
      setHideAmountTxn(false);
      setOtherReason('');
    } else if (remark?.value === 4) {
      // asked to come later
      setAmount('0');
      setDisableAmount(true);
      setDisableTransactionNo(true);
      setShowNextVisitDate(true);
      setShowCustomReason(false);
      setHideAmountTxn(true);
      setOtherReason('');
    } else if (remark?.value === 8) {
      // others
      setAmount('0');
      setDisableAmount(true);
      setDisableTransactionNo(true);
      setShowNextVisitDate(false);
      setShowCustomReason(true);
      setHideAmountTxn(true)
    } else if (remark?.value === 3 || remark?.value === 5 || remark?.value === 6) {
      setAmount('0');
      setDisableAmount(true);
      setDisableTransactionNo(true);
      setShowNextVisitDate(false);
      setShowCustomReason(false);
      setHideAmountTxn(true);
      setOtherReason('');
    }
  }, [remark]);



  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };



  const getCurrentLocation = async () => {
    console.log('getCurrentLocation')
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission denied');
      return;
    }
    console.log('getCurrentLocation ' + hasPermission);
    setIsLocationFetching(true)
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        setIsLocationFetching(false)
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
      },
      (err) => {
        // setError(err.message);
        setIsLocationFetching(false)
        console.error(err);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };



  const createDemandTransaction = async () => {
    if (remark?.value === 8 && otherReason === '') {
      Alert.alert('Validation Error', 'Please provide other reason.');
      return;
    } else if (remark?.value === 1 || remark?.value === 2) {
      if (trasactionNo.trim() === '') {
        Alert.alert('Validation Error', 'Please provide transaction number.');
        return;
      }

      if (Number(amount) === 0) {
        Alert.alert('Validation Error', 'Amount Cannot be 0 (zero).');
        return;
      }

      if (isNaN(Number(amount))) {
        Alert.alert('Validation Error', 'Please enter a valid amount.');
        return;
      }
    }


    const paylaod: AddDemandTxnType = {
      billDate: new Date().toISOString(),
      txnDate: new Date().toISOString(),
      billNo: 0,
      propertyId: property?.propertyId,
      demandId: route.params.demandId,
      amountPaid: [1, 2].includes(Number(remark?.value || 0)) ? amount : 0,
      remarks: String(remark?.value) || '',
      customReason: otherReason,
      paymentTxnNumber: trasactionNo,
      nextVisitDate: remark?.value === 4 ? getDate(nextVisitDate.toISOString()) : null,
      attribute0: String(user.id),
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
    }

    console.log(paylaod);

    try {
      const { data } = await addDemandTransaction(paylaod);
      if (data.code === 200 && data.status === 'Success') {
        Alert.alert('Success', 'Transaction Added Successfully.');
        navigation.goBack();
      }
    } catch (error) {
      console.log(error)
    }
  }



  const handleUpdatePress = async () => {
    Alert.alert(
      "Confirmation", // Title
      "Are you sure you want to update?", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "OK",
          onPress: async () => {
            console.log("OK Pressed");
            await createDemandTransaction()
          }
        }
      ],
      { cancelable: false } // (Android only)
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PopertyNumberBanner />
      <Text variant='headlineSmall' style={{ textAlign: 'center', marginBottom: 12 }}>Collection</Text>
      {/* <View style={{flexDirection:'row', gap: 6}}>
          <Text style={{...styles.cell, flex: 1, borderColor: theme.colors.primary, fontWeight: 'bold'}}>FY</Text>
          <Text style={{...styles.cell, flex: 3, borderColor: theme.colors.primary, fontWeight: 'bold'}}>Demand No</Text>
        </View> */}

      {/* <View style={{ flexDirection: 'row', gap: 6 }}>
        <Text style={{ flex: 1, }}>Previous Year Due</Text>
        <Text style={{ flex: 1, textAlign: 'right' }}>2000.00</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Text style={{ flex: 1, }}>Current Year Due</Text>
        <Text style={{ flex: 1, textAlign: 'right' }}>3000.00</Text>
      </View> */}

      <View style={{ marginTop: 6, paddingTop: 6, flexDirection: 'row', gap: 6, borderTopColor: theme.colors.primary, borderTopWidth: 2 }}>
        <Text variant="titleMedium" style={{ flex: 1, color: theme.colors.primary }}>Total Amount Pending</Text>
        <Text variant="titleMedium" style={{ flex: 1, textAlign: 'right', color: theme.colors.primary }}>{route.params.amountPending}</Text>
      </View>

      <View style={{ marginTop: 40, gap: 12 }}>
        <Dropdown label="Remark" options={remarkOptions} value={remark} onSelect={setRemark} />
        {!hideAmountTxn && <>
          <Input label="Amount" disabled={disableAmount} value={amount} keyboardType="numeric" onChangeText={setAmount} />
          <Input label="Transaction Number" disabled={disableTransactionNo} value={trasactionNo} onChangeText={setTransactionNo} />
        </>}
        {showNextVisitDate && <Datepicker date={nextVisitDate} onConfirm={setNextVisitDate} />}
        {showCustomReason && <Input value={otherReason} onChangeText={setOtherReason} label="Type other reason" />}
      </View>

      <View style={{ marginTop: 12 }}>
        {/* <CustomImagePicker label='Choose your visit photo' value={image} setValue={(v: string) => setImage(v)} placeholder='Tap to upload image of the property' /> */}
      </View>
      {/* <View style={{ marginTop: 12 }}>
        <Button mode='outlined' style={{ height: 40 }}
          icon={() => <Icon name='map-marker' color={theme.colors.primary} size={20} />}
          loading={isLocationFetching}
          onPress={getCurrentLocation}>Get Current Location</Button>
      </View>
      <View>
        {!isLocationFetching && longitude && latitude && <Text style={{ fontSize: 12, textAlign: 'center' }}>Long: {longitude}, Lat: {latitude}</Text>}
      </View> */}

      <View style={{ flexDirection: 'row', gap: 6, marginTop: 30, marginBottom: 80 }}>
        <Button style={{ marginTop: 12, flex: 1 }} mode='contained' disabled={!remark?.value} onPress={handleUpdatePress}>Update</Button>
        <Button style={{ marginTop: 12, flex: 1 }} mode='outlined' onPress={() => navigation.goBack()}>Back</Button>
      </View>

    </ScrollView>
  )
}

export default PaymentCollection

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  cell: {
    borderWidth: 1,
    padding: 6
  }
})