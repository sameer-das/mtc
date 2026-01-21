import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import { PropertyContext } from '../contexts/PropertyContext'
import { Text, useTheme } from 'react-native-paper';

const PopertyNumberBanner = () => {
  const { property } = useContext(PropertyContext);
  const theme = useTheme()
  return (
    <View style={{}}>
      {property?.householdNo && <Text variant='labelSmall' selectable style={{ textAlign: 'right', color: theme.colors.primary }}>PIN: {property?.householdNo}</Text>}
      {property?.attribute6 && <Text variant='labelSmall' selectable style={{ textAlign: 'right', color: theme.colors.primary }}>SURVEY: {property?.attribute6}</Text>}
    </View>
  )
}

export default PopertyNumberBanner

const styles = StyleSheet.create({})