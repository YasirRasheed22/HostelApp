import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  View,
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
  const [loading, setLoading] = useState(true);

  // Check for existing user
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        navigation.reset({
          index:0,
          routes:[{name:'Dashboard'}]
        });
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please fill in all fields');
    }

    try {
      setLoading(true);
      await AsyncStorage.clear();
      const payload = { email, password };
      const response = await axios.post(`${ApiUrl}/api/helper/login`, payload);

      if (response.data?.user?.role === 'user') {
        await AsyncStorage.setItem('privileges', JSON.stringify(response.data.user.privileges));
      }

      await AsyncStorage.setItem('db_name', response.data.user.db_name);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      navigation.reset({
          index:0,
          routes:[{name:'Dashboard'}]
        });
    } catch (error) {
      console.log(error);
      Alert.alert('Login failed', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: font.primary,
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
    backgroundColor: '#75AB38',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: font.secondary,
  },
  linkText: {
    color: '#4f46e5',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: font.secondary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
});
