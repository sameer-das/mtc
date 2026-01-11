import { StyleSheet, ScrollView, View, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CustomImagePicker from '../../../components/CustomImagePicker'
import { Button, Text, useTheme } from 'react-native-paper';
import { PropertyDocumentUploadPayload } from '../../../Models/models';
import { AuthContext } from '../../../contexts/AuthContext';
import { propertyDocumentDownload, propertyDocumentList, propertyDocumentUpload } from '../../../API/service';
import { PropertyContext } from '../../../contexts/PropertyContext';
import Loading from '../../../components/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../../API/ApiClient';

const getFileName = (filename: string) => {
  const splited = filename.split('.');
  splited.splice(-1, 1) // delete the last extension one 
  return splited.join('_');
}
const Document = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { property } = useContext(PropertyContext);
  const [loading, setLoading] = useState(false);
  const safeAreaInsets = useSafeAreaInsets();

  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

  const fetchDocumentList = async () => {
    console.log("fetchDocumentList")

    try {
      const { data } = await propertyDocumentList(property?.propertyId || 0);
      if (data.code === 200 && data.status === 'Success') {
        for (let d of data.data) {
          if (d.documentType === 'Property_Image1') {
            setImage1(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
          } else if (d.documentType === 'Property_Image2') {
            setImage2(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
          } else if (d.documentType === 'Property_Image3') {
            setImage3(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
          } else if (d.documentType === 'Property_Image4') {
            setImage4(`${API_BASE_URL}/Master/propertyDocumentDownload?fileName=${d.documentName}`);
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error getting document list of property.');
      console.log(error);
    }
  }



  useEffect(() => {
    fetchDocumentList()
  }, [])


  const handleUpload = async (filemetadata: any) => {

    setLoading(true);

    try {
      const payload: PropertyDocumentUploadPayload = {
        documentId: 0,
        documentName: getFileName(filemetadata.filename),
        documentType: filemetadata.identifier,
        documentUploadedBy: user.id,
        documentUploadedOn: new Date().toISOString(),
        propertyId: property?.propertyId || 0,
        documentContent: filemetadata.imageContent
      }
      // console.log(payload)
      const { data } = await propertyDocumentUpload(payload);
      console.log(data);

      if (data.code === 200 && data.status === 'Success') {
        Alert.alert('Success', 'Image uploaded successfully.')
      } else {
        Alert.alert('Fail', 'Image upload failed.')
      }

    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Image upload error.')
    } finally {
      setLoading(false);
    }
  }


  if (loading)
    return <Loading visible={loading} />
  return (
    <ScrollView style={styles.contanier}>
      <View style={{ display: 'flex', gap: 12, marginBottom: safeAreaInsets.bottom + 80 }}>
        <Text variant='titleSmall' style={{ marginVertical: 12, textAlign: 'center', color: theme.colors.primary }}>Upload images from 4 sides of the property.</Text>
        <View style={{}} >
          <CustomImagePicker identifier='Property_Image1' label='Image 1' value={image1} setValue={(v: string) => setImage1(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
          <CustomImagePicker identifier='Property_Image2' label='Image 2' value={image2} setValue={(v: string) => setImage2(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
          <CustomImagePicker identifier='Property_Image3' label='Image 3' value={image3} setValue={(v: string) => setImage3(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
          <CustomImagePicker identifier='Property_Image4' label='Image 4' value={image4} setValue={(v: string) => setImage4(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
        </View>
        {/* <Button style={{ marginTop: 30, marginBottom: 80 }} mode='contained' disabled={!image1 && !image2 && !image3 && !image4} onPress={handleUpload}>Upload Images</Button> */}

      </View>

    </ScrollView>
  )
}

export default Document

const styles = StyleSheet.create({
  contanier: {
    flexGrow: 1,
  }
})