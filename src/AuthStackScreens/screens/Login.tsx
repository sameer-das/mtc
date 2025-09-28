import { Pressable, StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { loginUser } from '../../API/service'
import { TextInput, Text, Button, useTheme } from 'react-native-paper';
import Input from '../../components/Input';

const Login = () => {
  const { login,loading } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const theme = useTheme()

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const handleLogin = async () => {
    try {
      const resp = await loginUser({ username, password });
      if (resp.status === 200) {
        login(resp.data);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleRegister = () => {}


  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant='displayMedium' style={styles.headerText}>Login</Text>
      <View style={styles.loginBox}>
        <Input
          label='Username'
          placeholder='Enter your username'
          value={username}
          onChangeText={(nextValue: string) => setUsername(nextValue)}
        />
        <Input
          label='Password'
          placeholder='Enter your password'
          value={password}
          secureTextEntry={secureTextEntry}
          right={<TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={togglePasswordVisibility} />}
          onChangeText={(nextValue: string) => setPassword(nextValue)}
        />
        <Button mode='contained' loading={loading} disabled={!username || !password} onPress={handleLogin}>Login</Button>
        <Button mode='text' onPress={handleRegister}>Register</Button>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: { textAlign: 'center', marginTop: 150, marginBottom: 20 },
  loginBox: {
    width: '80%',
    display: 'flex',
    gap: 20
  }
})