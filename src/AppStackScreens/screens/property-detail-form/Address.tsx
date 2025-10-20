import { PermissionsAndroid, ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import { Text, Switch, useTheme, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/material-design-icons'
import Geolocation from '@react-native-community/geolocation';
import Loading from '../../../components/Loading';

interface PropertyAddressType {
  propertyAddress: string,
  propertyAddressDistrict: string,
  propertyAddressCity: string,
  propertyAddressPin: string,
  isOwnerAddressSame: boolean,
  ownerAddress: string,
  ownerAddressDistrict: string,
  ownerAddressCity: string,
  ownerAddressPin: string,
  latitude: number | null,
  longitude: number | null,
}

const validationSchema = Yup.object().shape({
  propertyAddressDistrict: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  propertyAddressCity: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  propertyAddressPin: Yup.string().matches(/^[0-9]+$/, 'Only digits.').min(6, '6 digits.').max(6, '6 digits.'),

  ownerAddressDistrict: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  ownerAddressCity: Yup.string().matches(/^[a-zA-Z ]*$/, 'Allowed only alphabets.'),
  ownerAddressPin: Yup.string().matches(/^[0-9]+$/, 'Only digits.').min(6, '6 digits.').max(6, '6 digits.'),
})



const Address = () => {
  const [initialValues, setInitialValues] = useState<PropertyAddressType>({
    propertyAddress: '',
    propertyAddressDistrict: '',
    propertyAddressCity: '',
    propertyAddressPin: '',
    isOwnerAddressSame: false,
    ownerAddress: '',
    ownerAddressDistrict: '',
    ownerAddressCity: '',
    ownerAddressPin: '',
    latitude: null,
    longitude: null,
  });

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



  return (
    <ScrollView>
      <Loading visible={loading} />
      <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={(values) => console.log(values)}>
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
                  setFieldValue('latitude', String(position.coords.latitude));
                  setFieldValue('longitude', String(position.coords.longitude));
                },
                (err) => {
                  // setError(err.message);
                  setIsLocationFetching(false)
                  console.error(err);
                },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
              );
            };

            return (<View style={{ display: 'flex', marginBottom: safeAreaInsets.bottom + 80 }}>
              <Text variant="titleSmall" style={{ textAlign: 'left', marginVertical: 8, }}>Address of the Property</Text>
              <View style={{ marginBottom: 8 }}>
                <Input label='Address' value={values.propertyAddress} onChangeText={handleChange('propertyAddress')} />
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

              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                <Text variant='labelMedium' style={{ color: theme.colors.primary }}>Owner's Address is as same as property address</Text>
                <Switch value={values.isOwnerAddressSame} onValueChange={(same) => {
                  setFieldValue('isOwnerAddressSame', same);
                  if (same) {
                    setFieldValue('ownerAddress', values.propertyAddress)
                    setFieldValue('ownerAddressDistrict', values.propertyAddressDistrict)
                    setFieldValue('ownerAddressCity', values.propertyAddressCity)
                    setFieldValue('ownerAddressPin', values.propertyAddressPin)
                  } else {
                    setFieldValue('ownerAddress', '')
                    setFieldValue('ownerAddressDistrict', '')
                    setFieldValue('ownerAddressCity', '')
                    setFieldValue('ownerAddressPin', '')
                  }
                }} />
              </View>


              <Text variant="titleSmall" style={{ textAlign: 'left', marginVertical: 8 }}>Correspondence address of the owner</Text>
              <View style={{ marginBottom: 8 }}>
                <Input label='Address' disabled={values.isOwnerAddressSame} value={values.ownerAddress} onChangeText={handleChange('ownerAddress')} />
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

              <Text variant="titleSmall" style={{ textAlign: 'left', marginVertical: 8 }}>Current location of property</Text>

              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                <View style={{ flex: 1 }}>
                  <Input label='Latitude' disabled value={values.latitude} onChangeText={handleChange('latitude')} />
                </View>
                <View style={{ flex: 1 }}>
                  <Input label='Longitude' disabled value={values.longitude} onChangeText={handleChange('longitude')} />
                </View>
              </View>

              <View style={{ marginTop: 16 }}>
                <Button mode='outlined' style={{ height: 40 }}
                  icon={() => <Icon name='map-marker' color={theme.colors.primary} size={20} />}
                  loading={isLocationFetching}
                  onPress={getCurrentLocation}>Get Current Location</Button>
              </View>

              <Button style={{ marginTop: 12 }} mode='contained' disabled={!isValid} onPress={handleSubmit}>Update Property Address</Button>


            </View>)
          }
        }
      </Formik>
    </ScrollView>
  )
}

export default Address

const styles = StyleSheet.create({})