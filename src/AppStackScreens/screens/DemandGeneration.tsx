import { StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import PopertyNumberBanner from './PopertyNumberBanner'
import { PropertyContext } from '../../contexts/PropertyContext'
import { Button, Text } from 'react-native-paper'
import Dropdown from '../../components/Dropdown'

const DemandGeneration = () => {
  const { property } = useContext(PropertyContext);
  const [financialYearOptions, setFinancalYearOptions] = useState([
    { label: 'FY-2024-25', value: 'FY-2024-25' },
    { label: 'FY-2025-26', value: 'FY-2025-26' },
  ])

  const [financialYear, setFinancialYear] = useState({});

  return (
    <View style={styles.container}>
      <PopertyNumberBanner />
      <Text variant='headlineSmall' style={{ textAlign: 'center', marginBottom: 12 }}>Demand Generation</Text>
      <View>
        <Text>Name: {property?.salutaion} {property?.ownerName}</Text>
        {(property?.careOf && property?.guardianName) && <Text>{property?.careOf}: {property?.guardianName}</Text>}
      </View>
      <View style={{ marginTop: 16 }}>
        <Text>Due: 5000</Text>
      </View>
      <View style={{ marginTop: 16 }}>
        <Dropdown label="Financial Year" options={financialYearOptions} value={financialYear} onSelect={setFinancialYear} />
        <Button style={{marginTop: 8}} mode='contained' disabled={!financialYear?.value}>Generate</Button>
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