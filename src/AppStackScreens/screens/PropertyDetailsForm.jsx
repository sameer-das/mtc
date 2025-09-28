import { ScrollView, StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Text, useTheme, Button  } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PropertyDetailsForm = () => {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={{ ...styles.container, backgroundColor: theme.colors.background }}>

      <Text variant="headlineSmall" style={{ textAlign: 'center' }}>Property Details</Text>

      <ScrollView style={{ flexGrow: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column', gap: 8, borderColor: 'red', borderWidth: 1, marginBottom: safeAreaInsets.bottom + 40 }}>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
          <Text>asdasdfsdsdf</Text>
        </View>
        
      </ScrollView>
      <View style={styles.bottomButton}>

          <Button style={{ marginBottom: safeAreaInsets.bottom }} mode='contained'>Update</Button>
        </View>

    </KeyboardAvoidingView>
  )
}

export default PropertyDetailsForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  bottomButton : {
    position: 'absolute',
    bottom: 0, // Aligns the button to the bottom of the screen
    left: 0,
    right: 0,
  }
})