import React, { useContext } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button, Text, useTheme } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';
import Icon from '@react-native-vector-icons/material-design-icons'

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();

  const { logout, user } = useContext(AuthContext);
  console.log(user)  
  return (
    <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', borderBottomColor: theme.colors.primary, borderBottomWidth: 1, paddingVertical: 8 }}>
        <Text variant='titleMedium'>Welcome {user.firstName}</Text>
        <Button mode='outlined' icon={() => <Icon name='logout' size={20} color={theme.colors.primary} />} 
        style={{ marginTop: 10, width: '30%' }} onPress={logout}>Logout</Button>
      </View>
      <View style={{ flex: 1, marginTop: 80, gap: 16 }}>
        <Button mode='contained' onPress={() => navigation.push('Search')}>Search Property/Survey</Button>
        <Button mode='contained' onPress={() => navigation.push('CreatePropertyStack')}>Quick Add Property</Button>
        <Button mode='outlined' onPress={() => navigation.push('SurveyListStack')}>My Surveys</Button>
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
})