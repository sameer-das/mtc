import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { PropertyContext } from '../../contexts/PropertyContext'
import { useTheme } from 'react-native-paper';

const PopertyNumberBanner = () => {
  const {property} = useContext(PropertyContext);
  const theme = useTheme()
  return (
    <View>
      <Text style={{textAlign: 'right', color: theme.colors.primary}}>PIN: {property?.householdNo }</Text>
    </View>
  )
}

export default PopertyNumberBanner

const styles = StyleSheet.create({})