
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  const payload = {
    email: email,
    password: password,
  };

  if (email && password) {
    try {
      console.log(payload);
      const response = await axios.post(`${ApiUrl}/api/helper/login`, payload);
      AsyncStorage.setItem("db_name", (response.data.user.db_name));
      console.log("Database Name .............." , response.data.user.db_name)
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
      Alert.alert("Login failed", error.response?.data?.message || error.message);
    }
  } else {
    Alert.alert('Please fill in all fields');
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your hostel dashboard</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily:font.primary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    // fontWeight: 'bold',
    fontSize: 16,
    fontFamily:font.secondary,
  },
  linkText: {
    color: '#4f46e5',
    textAlign: 'center',
    marginTop: 10,
    fontFamily:font.secondary,
  },
    safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
});
