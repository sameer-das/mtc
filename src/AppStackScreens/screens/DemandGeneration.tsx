import { StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import PopertyNumberBanner from './PopertyNumberBanner'
import { PropertyContext } from '../../contexts/PropertyContext'
import { Button, Text, useTheme } from 'react-native-paper'
import Dropdown from '../../components/Dropdown'
import { useNavigation } from '@react-navigation/native'
import { SelectType } from '../../Models/models'

const DemandGeneration = () => {
  const theme = useTheme()
  const navigation = useNavigation()
  const { property } = useContext(PropertyContext);

  const [financialYearOptions, setFinancalYearOptions] = useState<SelectType[]>([
    { label: 'FY-2024-25', value: 'FY-2024-25' },
    { label: 'FY-2025-26', value: 'FY-2025-26' },
  ])

  const [financialYear, setFinancialYear] = useState<SelectType>();

  return (
    <View style={styles.container}>
      <PopertyNumberBanner />
      <Text variant='headlineSmall' style={{ textAlign: 'center', marginBottom: 12 }}>Demand Generation</Text>
      <View>
        <Text variant="titleSmall">Name: {property?.salutaion} {property?.ownerName}</Text>
        {(property?.careOf && property?.guardianName) && <Text>{property?.careOf}: {property?.guardianName}</Text>}
        <Text variant="titleMedium" style={{ color: theme.colors.primary }}>Total Due: 5000</Text>
      </View>
      <View style={{ marginTop: 16 }}>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text variant="titleMedium" style={{ textAlign: 'left', marginVertical: 6, color: theme.colors.primary }}>All Previous Demands</Text>
        <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 6, borderBottomWidth: 1 }}>
          <Text variant="titleSmall" style={{ flex: 1 }}>FY</Text>
          <Text variant="titleSmall" style={{ flex: 1 }}>Amount</Text>
          <Text variant="titleSmall" style={{ flex: 1 }}>Date</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 6 }}>
          <Text style={{ flex: 1 }}>FY-2025-26</Text>
          <Text style={{ flex: 1 }}>4000.00</Text>
          <Text style={{ flex: 1 }}>25-July-2025</Text>
        </View>
      </View>
      <View style={{ marginTop: 40 }}>
        <Dropdown label="Financial Year" options={financialYearOptions} value={financialYear} onSelect={setFinancialYear} />
        <Button style={{ marginTop: 12 }} mode='contained' disabled={!financialYear?.value}>Generate</Button>
        <Button style={{ marginTop: 12 }} mode='outlined' onPress={() => navigation.goBack()}>Back</Button>

      </View>
    </View>
  )
}

export default DemandGeneration

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
})