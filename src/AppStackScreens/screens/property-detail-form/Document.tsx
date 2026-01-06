import { StyleSheet, ScrollView, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CustomImagePicker from '../../../components/CustomImagePicker'
import { Button, Text, useTheme } from 'react-native-paper';
import { PropertyDocumentUploadPayload } from '../../../Models/models';
import { AuthContext } from '../../../contexts/AuthContext';
import { propertyDocumentDownload, propertyDocumentList, propertyDocumentUpload } from '../../../API/service';
import { PropertyContext } from '../../../contexts/PropertyContext';

const getFileName = (filename: string) => {
  const splited = filename.split('.');
  splited.splice(-1, 1) // delete the last extension one 
  return splited.join('_');
}
const Document = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { property } = useContext(PropertyContext);

  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

  const fetchDocumentList = async () => {
    try {
      const { data } = await propertyDocumentList(property?.propertyId || 0);
      console.log(data)
      if (data.code === 200 && data.status === 'Success') {
        for (let d of data.data) {
          const { data: fileDownloadResp } = await propertyDocumentDownload(d.documentName);
          // console.log(fileDownloadResp);
        }
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchDocumentList()
  }, [])


  const handleUpload = async (filemetadata: any) => {
    console.log("Image uploaded");

    try {
      const payload: PropertyDocumentUploadPayload = {
        documentId: 0,
        documentName: getFileName(filemetadata.filename),
        documentType: `Property_${filemetadata.label.split(' ').join('')}`,
        documentUploadedBy: user.id,
        documentUploadedOn: new Date().toISOString(),
        propertyId: property?.propertyId || 0,
        documentContent: filemetadata.imageContent
      }
      // console.log(payload)
      const resp = await propertyDocumentUpload(payload);
      console.log(resp)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <ScrollView>
      <Text variant='titleSmall' style={{ marginVertical: 12, textAlign: 'center', color: theme.colors.primary }}>Upload images from 4 sides of the property.</Text>
      <View style={{}} >
        <CustomImagePicker label='Image 1' value={image1} setValue={(v: string) => setImage1(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
        <CustomImagePicker label='Image 2' value={image2} setValue={(v: string) => setImage2(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
        <CustomImagePicker label='Image 3' value={image3} setValue={(v: string) => setImage3(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />
        <CustomImagePicker label='Image 4' value={image4} setValue={(v: string) => setImage4(v)} placeholder='Tap to choose image.' onUpload={handleUpload} />

      </View>
      {/* <Button style={{ marginTop: 30, marginBottom: 80 }} mode='contained' disabled={!image1 && !image2 && !image3 && !image4} onPress={handleUpload}>Upload Images</Button> */}

    </ScrollView>
  )
}

export default Document

const styles = StyleSheet.create({})