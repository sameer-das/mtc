import { StyleSheet, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CustomImagePicker from '../../../components/CustomImagePicker'
import { Button } from 'react-native-paper';

const Document = () => {
  const [image, setImage] = useState('');
  return (
    <ScrollView>
      <CustomImagePicker label='' value={image} setValue={(v: string) => setImage(v)} placeholder='Tap to upload image of the property' />
      <Button style={{ marginTop: 8 }} mode='contained' disabled={!image} onPress={() => console.log("Image uploaded")}>Update Property Image</Button>

    </ScrollView>
  )
}

export default Document

const styles = StyleSheet.create({})