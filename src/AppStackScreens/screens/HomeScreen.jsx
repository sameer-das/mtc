import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, useTheme } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';

const HomeScreen = ({navigation}) => {
  const theme = useTheme();

  const {logout,user} = useContext(AuthContext);

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Button mode='contained'  onPress={() => navigation.push('Search')}>Search Property</Button>
      {/* <Pressable style>Search</Pressable> */}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    padding: 8,
  },
})