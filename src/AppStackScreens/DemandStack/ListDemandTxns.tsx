import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Switch, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PopertyNumberBanner from '../PopertyNumberBanner';
import { PropertyContext } from '../../contexts/PropertyContext';
import { AuthContext } from '../../contexts/AuthContext';
import { getDemandsTxnOfProperty } from '../../API/service';
import { useRoute } from '@react-navigation/native';
import { TRANSACTION_REMARKS } from '../../constants/constants';


const getRemarksLabel = (remarkValue: number) => {
  return TRANSACTION_REMARKS.find(c => +c.value === +remarkValue)?.label;
}


const getDate = (date: Date | string) => {
  const d = new Date(date).getTime() + 19800000;
  return new Date(d).toISOString();
}

const ListDemandTxns = () => {

  const safeAreaInsets = useSafeAreaInsets();
  const { property } = useContext(PropertyContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const route = useRoute();
  const [txns, setTxns] = useState([]);
  const [displayTxns, setDispalyTxns] = useState([]);
  const [showAllTxns, setShowAllTxns] = React.useState(false);


  useEffect(() => {
    if (showAllTxns) {
      setDispalyTxns(txns)
    } else {
      setDispalyTxns(txns.filter(c => c.amountPaid > 0))
    }
  }, [showAllTxns]);



  const fetchAllTxnsOfProperty = async () => {
    try {
      // console.log('fetch ward ', zoneId)
      const { data } = await getDemandsTxnOfProperty(property?.propertyId, route.demandId);
      console.log(data)
      if (data.code === 200 && data.status === 'Success') {
        // setDemands(data.data.demands);
        const t = data.data.map(c => ({ ...c, remarkLabel: getRemarksLabel(c.remarks) }));
        setTxns(t);
        if (showAllTxns) {
          setDispalyTxns(t)
        } else {
          setDispalyTxns(t.filter(c => c.amountPaid > 0))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  const renderItem = ({ item }) => (
    <Pressable onPress={() => console.log(item)} style={{ borderBottomColor: theme.colors.onBackground, borderBottomWidth: 1, paddingVertical: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {item.amountPaid === 0 ?
          <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Visit Comment</Text> :
          <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Bill No : {item.billNo}</Text>
        }
        {item.amountPaid !== 0 && <Text variant='titleSmall' style={{ color: theme.colors.primary }}>Amount Paid : {item.amountPaid}</Text>}
      </View>

      <View>
        <Text variant='titleSmall'>{item.remarkLabel}</Text>
        {
          item.remarks === '4' ? <Text variant='bodySmall'>Next Vist Date: {new Date(item.nextVisitDate).toLocaleDateString()}</Text> :
            item.remarks === '8' ? <Text variant='bodySmall'>Reason: {item.customReason}</Text> : null
        }
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

        <Text variant='bodySmall'>Date : {new Date(item.txnDate).toLocaleString()}</Text>
      </View>
    </Pressable>
  );

  useEffect(() => {
    fetchAllTxnsOfProperty()
  }, [])
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background, marginBottom: safeAreaInsets.bottom }}>
      <View style={{ marginBottom: 125 }}>
        <PopertyNumberBanner />
        <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>All Transactions</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch value={showAllTxns} onValueChange={() => setShowAllTxns(!showAllTxns)} />
            <Text variant='bodySmall' style={{ color: theme.colors.primary }}>Show All</Text>
          </View>

          <Text variant='bodySmall' style={{ color: theme.colors.primary }}>Showing {displayTxns.length}/{txns.length}</Text>
        </View>

        <FlatList data={displayTxns} renderItem={renderItem} keyExtractor={item => item.txnId} />
      </View>
    </View>
  )
}

export default ListDemandTxns

const styles = StyleSheet.create({
  container: {
    flex: 1, paddingHorizontal: 8
  }
})