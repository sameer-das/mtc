import { ScrollView, StyleSheet, View, KeyboardAvoidingView, PermissionsAndroid } from 'react-native'
import React, { useContext, useState } from 'react'
import { Text, useTheme, Button, SegmentedButtons } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Input from '../../components/Input'
import Geolocation from '@react-native-community/geolocation';
import { PropertyMaster } from '../../Models/models'
import { updatePropertyMaster } from '../../API/service'
import { AuthContext } from '../../contexts/AuthContext'
import Details from './property-detail-form/Details'
import Address from './property-detail-form/Address'
import Document from './property-detail-form/Document'
// import Geolocation from 'react-native-geolocation-service';

interface ButtonType { value: string; label: string }
const BUTTONS: ButtonType[] = [
  {
    value: 'details',
    label: 'Details',
  },
  {
    value: 'address',
    label: 'Address',
  },
  { value: 'documents', label: 'Documents' },
]

const renderContent = (value: string) => {
  switch (value) {
    case 'details':
      return <Details />
    case 'address':
      return <Address />
    case 'documents':
      return <Document />
  }
}

const PropertyDetailsForm = () => {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const [propertyDetail, setPropertyDetail] = useState({
    wardName: '',
    mohallaName: '',
    propertyType: '',
    category: '',
    subCategory: '',
    amount: 0,
    rate: 0,
    propertyAddress: ''
  });

  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [loc, setLoc] = useState([]);
  const [gettingLoc, setGettingLoc] = useState(false);
  const [segmentedButtonValue, setSegmentedButtonValue] = useState('details');


  const handleChange = (k: string) => {
    return (value: string) => {
      setPropertyDetail({ ...propertyDetail, [k]: value })
    }
  }

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


  

  const validate = () => {
    const onlyChar = new RegExp(/^[a-zA-Z ]*$/);
    const onlyNumber = new RegExp(/^[0-9]/g);
    return true
  }


  const handleUpdatePress = async () => {
    //  if(!validate()) {
    //   return;
    //  }
    const payload: PropertyMaster = {
      householdNo: 'AAAAAAA',
      wardName: propertyDetail.wardName,
      mohallaName: propertyDetail.mohallaName,
      propertyType: propertyDetail.propertyType,
      category: propertyDetail.category,
      subcategory: propertyDetail.subCategory,
      amount: propertyDetail.amount,
      rate: propertyDetail.rate,
      updatedBy: user.username
    }

    try {
      const resp = await updatePropertyMaster(payload);
      console.log(resp)
    } catch (e) {
      console.log(e);
    }
  }



  return (
    <KeyboardAvoidingView behavior="height" style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Text variant="titleMedium" style={{ textAlign: 'center', marginVertical: 8 }}>Property Details</Text>
      <SegmentedButtons style={{ marginVertical: 8 }} value={segmentedButtonValue}
        onValueChange={setSegmentedButtonValue}
        buttons={BUTTONS}>
      </SegmentedButtons>
        {
          renderContent(segmentedButtonValue)
        }
    </KeyboardAvoidingView>
  )
}

export default PropertyDetailsForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
})