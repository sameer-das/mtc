import { StyleSheet, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import CustomImagePicker from '../../../components/CustomImagePicker'
import { Button, Text, useTheme } from 'react-native-paper';

const Document = () => {
  const theme = useTheme()
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  return (
    <ScrollView>
      <Text variant='titleSmall' style={{marginVertical: 12, textAlign: 'center', color: theme.colors.primary}}>Upload images from 4 sides of the property.</Text>
      <View style={{  }} >
        <CustomImagePicker label='' value={image1} setValue={(v: string) => setImage1(v)} placeholder='Tap to choose image 1.' />
        <CustomImagePicker label='' value={image2} setValue={(v: string) => setImage2(v)} placeholder='Tap to choose image 2.' />
        <CustomImagePicker label='' value={image3} setValue={(v: string) => setImage3(v)} placeholder='Tap to choose image 3.' />
        <CustomImagePicker label='' value={image4} setValue={(v: string) => setImage4(v)} placeholder='Tap to choose image 4.' />

      </View>
      <Button style={{ marginTop: 30 , marginBottom: 80}} mode='contained' disabled={!image1 || !image2 || !image3 || !image4} onPress={() => console.log("Image uploaded")}>Upload Images</Button>

    </ScrollView>
  )
}

export default Document

const styles = StyleSheet.create({})