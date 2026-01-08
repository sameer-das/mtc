import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './src/contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './src/AppStackScreens/AppStack';
import AuthStack from './src/AuthStackScreens/AuthStack';
import { LightScheme } from './theme/light';
import { DarkScheme } from './theme/dark';
import { PropertyProvider } from './src/contexts/PropertyContext';
import HomeStack from './src/AppStackScreens/HomeStack';

const lightTheme = {
  ...MD3LightTheme,
  colors: LightScheme.colors
}
const darkTheme = {
  ...MD3DarkTheme,
  colors: DarkScheme.colors
}


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  // const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}


function AppContent() {
  console.log('App Content')
  const safeAreaInsets = useSafeAreaInsets();
  console.log(safeAreaInsets)
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Spinner size='giant' /> */}
      </View>
    );
  }
  return (
    <View style={{
      paddingTop: safeAreaInsets.top,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
      ...styles.container,
    }}>
      <NavigationContainer>
        {user ? <PropertyProvider>
          <HomeStack />
        </PropertyProvider> : <AuthStack />}
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
