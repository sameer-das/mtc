import { Alert, PermissionsAndroid, ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { Text, Switch, useTheme, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/material-design-icons'
import Geolocation from '@react-native-community/geolocation';
import Loading from '../../../components/Loading';
import { updatePropertyMaster } from '../../../API/service';
import { PropertyMaster } from '../../../Models/models';
import { PropertyContext } from '../../../contexts/PropertyContext';
import { AuthContext } from '../../../contexts/AuthContext';

interface PropertyAddressType {
  propertyAddress: string | null,
  propertyAddressDistrict: string | null,
  propertyAddressCity: string | null,
  propertyAddressPin: string | null,
  isOwnerAddressSame: boolean,
  ownerAddress: string | null,
  ownerAddressDistrict: string | null,
  ownerAddressCity: string | null,
  ownerAddressPin: string | null,
  attribute0: string | null,
  attribute1: string | null,
  attribute2: string | null,
  attribute3: string | null,
}

const validationSchema = Yup.object().shape({
  // propertyAddressDistrict: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  // propertyAddressCity: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  propertyAddressPin: Yup.string().nullable().matches(/^[0-9]+$/, 'Only digits.').min(6, '6 digits.').max(6, '6 digits.'),

  // ownerAddressDistrict: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  // ownerAddressCity: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  ownerAddressPin: Yup.string().nullable().matches(/^[0-9]+$/, 'Only digits.').min(6, '6 digits.').max(6, '6 digits.'),
})



const Address = () => {
  const {property} = useContext(PropertyContext);
  const { user } = useContext(AuthContext);


  const [initialValues, setInitialValues] = useState<PropertyAddressType>({
    propertyAddress: property?.propertyAddress || null,
    propertyAddressDistrict: property?.propertyAddressDistrict || null,
    propertyAddressCity: property?.propertyAddressCity || null,
    propertyAddressPin: property?.propertyAddressPin || null,
    isOwnerAddressSame: property?.isOwnerAddressSame || false,
    ownerAddress: property?.ownerAddress || null,
    ownerAddressDistrict: property?.ownerAddressDistrict || null,
    ownerAddressCity: property?.ownerAddressCity || null,
    ownerAddressPin:  property?.ownerAddressPin || null,
    attribute0: property?.attribute0 || null, // property house/buildig no
    attribute1: property?.attribute1 || null, // propert landmark
    attribute2: property?.attribute2 || null, //owner address house/building no
    attribute3: property?.attribute3 || null, // owner address land mark
  });

  const [longitude, setLongitude] = useState(property?.longitude);
  const [latitude, setLatitude] = useState(property?.latitude);

  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false)
  const [isLocationFetching, setIsLocationFetching] = useState(false)

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



  const updateDetails = async (values: PropertyAddressType) => {
    const updateAddressPayload: PropertyMaster = {
      householdNo: property?.householdNo,

      propertyAddress: values.propertyAddress,
      propertyAddressDistrict: values.propertyAddressDistrict,
      propertyAddressCity: values.propertyAddressCity,
      propertyAddressPin: values.propertyAddressPin,
      attribute0: values.attribute0,
      attribute1: values.attribute1,

      ownerAddress: values.ownerAddress,
      ownerAddressDistrict: values.ownerAddressDistrict,
      ownerAddressCity:values.ownerAddressCity,
      ownerAddressPin: values.ownerAddressPin,
      attribute2: values.attribute2,
      attribute3: values.attribute3,

      isOwnerAddressSame: Boolean(values.isOwnerAddressSame),

      latitude: latitude,
      longitude: longitude,

      updatedBy: user.username
    };
    console.log(updateAddressPayload)
    try {
      setLoading(true)
      const resp = await updatePropertyMaster(updateAddressPayload);

      if (resp.data.code === 200 && resp.data.status === 'Success') {
        Alert.alert('Success', 'Address updated successfully')
      } else {
        Alert.alert('Fail', 'Failed while updating address.')
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Error while updating address.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <ScrollView>
      <Loading visible={loading} />
      <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} 
        onSubmit={(values) => updateDetails(values)}>
        {
          ({ values, errors, handleSubmit, setFieldValue, handleChange, isValid }) => {

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

            return (
              <View style={{ display: 'flex', marginBottom: safeAreaInsets.bottom + 80 }}>
                <Text variant="titleSmall" style={{ textAlign: 'center', marginTop: 20, textDecorationLine: 'underline' }}>Address of the Property</Text>
                <View style={{ marginBottom: 8 }}>
                  <Input label='Address of Propery' value={values.propertyAddress} onChangeText={handleChange('propertyAddress')} />
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                  <View style={{ flex: 1 }}>
                    <Input label='District' value={values.propertyAddressDistrict} onChangeText={handleChange('propertyAddressDistrict')} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input label='City' value={values.propertyAddressCity} onChangeText={handleChange('propertyAddressCity')} />
                  </View>

                  <View style={{ width: '25%' }}>
                    <Input label='Pin' value={values.propertyAddressPin} onChangeText={handleChange('propertyAddressPin')} />
                  </View>
                </View>
                {/* For Errors */}
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.error, fontSize: 12 }}> {errors.propertyAddressDistrict ? errors.propertyAddressDistrict : ''} </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.error, fontSize: 12 }}> {errors.propertyAddressCity ? errors.propertyAddressCity : ''} </Text>
                  </View>

                  <View style={{ width: '25%' }}>
                    <Text style={{ color: theme.colors.error, fontSize: 12 }}> {errors.propertyAddressPin ? errors.propertyAddressPin : ''} </Text>
                  </View>
                </View>
                <View style={{ display: 'flex', gap: 8 }}>
                  <View>
                    <Input label='House No./Building No. of Property' value={values.attribute0} onChangeText={handleChange('attribute0')} />
                  </View>
                  <View>
                    <Input label='Landmark of Property' value={values.attribute1} onChangeText={handleChange('attribute1')} />
                  </View>
                </View>





                <Text variant="titleSmall" style={{ textAlign: 'center', marginTop: 32, textDecorationLine: 'underline' }}>Correspondence address of the owner</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 4 }}>
                  <Text variant='labelMedium' style={{ color: theme.colors.primary, marginBottom: 6 }}>Owner's Address is as same as property address</Text>
                  <Switch value={values.isOwnerAddressSame} onValueChange={(same) => {
                    setFieldValue('isOwnerAddressSame', same);
                    if (same) {
                      setFieldValue('ownerAddress', values.propertyAddress)
                      setFieldValue('ownerAddressDistrict', values.propertyAddressDistrict)
                      setFieldValue('ownerAddressCity', values.propertyAddressCity)
                      setFieldValue('ownerAddressPin', values.propertyAddressPin)
                      setFieldValue('attribute2', values.attribute0)
                      setFieldValue('attribute3', values.attribute1)
                    } else {
                      setFieldValue('ownerAddress', '')
                      setFieldValue('ownerAddressDistrict', '')
                      setFieldValue('ownerAddressCity', '')
                      setFieldValue('ownerAddressPin', '')
                      setFieldValue('attribute2', '')
                      setFieldValue('attribute3', '')
                    }
                  }} />
                </View>
                <View style={{ marginBottom: 8 }}>
                  <Input label='Address of the Owner' disabled={values.isOwnerAddressSame} value={values.ownerAddress} onChangeText={handleChange('ownerAddress')} />
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                  <View style={{ flex: 1 }}>
                    <Input label='District' disabled={values.isOwnerAddressSame} value={values.ownerAddressDistrict} onChangeText={handleChange('ownerAddressDistrict')} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input label='City' disabled={values.isOwnerAddressSame} value={values.ownerAddressCity} onChangeText={handleChange('ownerAddressCity')} />
                  </View>

                  <View style={{ width: '25%' }}>
                    <Input label='Pin' disabled={values.isOwnerAddressSame} value={values.ownerAddressPin} onChangeText={handleChange('ownerAddressPin')} />
                  </View>
                </View>
                {/* For Errors */}
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.error, fontSize: 12 }}> {errors.ownerAddressDistrict ? errors.ownerAddressDistrict : ''} </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.error, fontSize: 12 }}> {errors.ownerAddressCity ? errors.ownerAddressCity : ''} </Text>
                  </View>

                  <View style={{ width: '25%' }}>
                    <Text style={{ color: theme.colors.error, fontSize: 12 }}> {errors.ownerAddressPin ? errors.ownerAddressPin : ''} </Text>
                  </View>
                </View>
                <View style={{ display: 'flex', gap: 8 }}>
                  <View>
                    <Input label='House No./Building No. of the Owner' disabled={values.isOwnerAddressSame} value={values.attribute2} onChangeText={handleChange('attribute2')} />
                  </View>
                  <View>
                    <Input label='Landmark of the Owner' disabled={values.isOwnerAddressSame} value={values.attribute3} onChangeText={handleChange('attribute3')} />
                  </View>

                </View>






                <Text variant="titleSmall" style={{ textAlign: 'center', marginTop: 32, textDecorationLine: 'underline' }}>Current location of property</Text>
                <View style={{ marginTop: 16 }}>
                  <Button mode='outlined' style={{ height: 40 }}
                    icon={() => <Icon name='map-marker' color={theme.colors.primary} size={20} />}
                    loading={isLocationFetching}
                    onPress={getCurrentLocation}>Get Current Location</Button>
                  <View>
                    {(longitude || latitude) ? <Text style={{ fontSize: 12, textAlign: 'center' }}>Longitude: {longitude}, Latiude: {latitude}</Text> : <Text>''</Text>}
                  </View>
                </View>






                {/* <Text variant="titleSmall" style={{ textAlign: 'center', marginTop: 32, textDecorationLine: 'underline' }}>Land Related Data</Text>
                <View style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <View style={{ flex: 1 }}>
                    <Input label='Width of the Road sorrounding the property' value={values.widthOfRoad} onChangeText={handleChange('widthOfRoad')} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input label='Area of the property/plot (Sq. Ft.)' value={values.areaOfPlot} onChangeText={handleChange('areaOfPlot')} />
                  </View>
                </View> */}

                <Button style={{ marginTop: 20 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Address</Button>


              </View>)
          }
        }
      </Formik>
    </ScrollView>
  )
}

export default Address

const styles = StyleSheet.create({})