import { Dimensions, StyleSheet, View } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PopertyNumberBanner from '../PopertyNumberBanner';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const ViewDemandPdf = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const route = useRoute();
  console.log(route)

  // const source = { uri: 'https://pdfobject.com/pdf/sample.pdf', cache: true };
  const source = { uri: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf', cache: true };
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <View>
        <PopertyNumberBanner />
        {/* <Text variant="headlineSmall" style={{ textAlign: 'center', marginVertical: 8 }}>Demand</Text> */}
        <View style={{flexDirection:'row', justifyContent:'flex-end', marginVertical: 8}}>
          <Button mode='outlined'>Download</Button>
        </View>
      </View>

      <Pdf source={source}
        trustAllCerts={false}
        onLoadComplete={(numberOfPages, filePath) => {
          // console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log('Error loading pdf page')
          console.log(error);
        }}
        style={styles.pdf}
        fitPolicy={0}
        spacing={0} />

    </View>
  )
}

export default ViewDemandPdf

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 40
    // borderColor:'red',
    // borderWidth: 1
  },

})