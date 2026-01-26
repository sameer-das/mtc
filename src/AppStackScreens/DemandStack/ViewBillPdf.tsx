import { Alert, Dimensions, StyleSheet, View } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PopertyNumberBanner from '../PopertyNumberBanner';
import { Button, Text, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../../API/ApiClient';
import ReactNativeBlobUtil from 'react-native-blob-util';

const ViewBillPdf = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const route = useRoute();
  // console.log(route)


  const downloadPdf = async () => {
    const { config, fs } = ReactNativeBlobUtil;
    const date = new Date();
    const fileDir = fs.dirs.DownloadDir; // Standard Download folder on Android
    console.log(fs)
    const res = await config({
      fileCache: true,
    }).fetch('GET', `${API_BASE_URL}/Master/ownerDocumentDownload?fileName=${route.params.billPdf}`)

    const path = res.path();
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: `${route.params.billPdf}`,
        parentFolder: 'MTC_BILL', // Optional: e.g., 'MyAppFiles'
        mimeType: 'application/pdf',
      },
      'Download', // The public directory (Download, Audio, Image, Video)
      path
    );

    // Optional: Remove the temporary file from cache
    await fs.unlink(path);
    Alert.alert('Download', 'The file downloaded successfully.');
  };

  const source = { uri: `${API_BASE_URL}/Master/ownerDocumentDownload?fileName=${route.params.billPdf}`, cache: true };

  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <View>
        <PopertyNumberBanner />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
          <View>
            <Text variant='titleMedium' >Bill/Receipt</Text>
            {/* <Text variant='bodyMedium' selectable style={{ color: theme.colors.primary }} >{route.params.demandNo}</Text> */}

          </View>
          <Button mode='outlined' onPress={downloadPdf}>Download</Button>
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

export default ViewBillPdf

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