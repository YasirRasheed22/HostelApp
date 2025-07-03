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
  ScrollView,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import { Provider } from 'react-native-paper';
import AlertModal from '../components/CustomAlert';
export default function ForgetPassword() {
   const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading , setLoading] = useState(false)
 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); // or 'success'

  useEffect(() => {
    
  
  }, []);

  const handleLogin = async () => {
    if (!email) {
      return(
        setModalType('danger'),
        setModalMessage('Please fill all fields..'),
        setModalVisible(true)
      );
    }

    try {
      setLoading(true);
      await AsyncStorage.clear();
      
      const payload = { email, password };
      const response = await axios.post(`${ApiUrl}/api/helper/login`, payload);
      console.log(response)

      if (response.data?.user?.role === 'user') {
        await AsyncStorage.setItem('privileges', JSON.stringify(response.data.user.privileges));
      }

      await AsyncStorage.setItem('db_name', response.data.user.db_name);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      const status = error?.response?.status;

      if (status === 400) {
        setModalType('danger');
        setModalMessage('Your profile is under review. Please wait for admin approval.');
        setModalVisible(true);
      } else {
        setModalType('danger');
        setModalMessage('Invalid Credentials..');
        setModalVisible(true);
      }
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
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <AlertModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          message={modalMessage}
          type={modalType}
        />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require('../assets/profile-9.webp')}
              style={styles.logo}
            />

            <Text style={styles.title}>Password is gone?</Text>
            <Text style={styles.subtitle}>Let's reset it!</Text>
            <Text style={styles.left}>Please enter your email to receive a link to reset your password.</Text>
            <Text style={styles.left}>If you are a member, please login.</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={text => setEmail(text.toLowerCase())}
            />

           

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>

            
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Provider>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: font.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
   left: {
    fontSize: 16,
    color: '#666',
    fontFamily: font.primary,
    marginBottom: 20,
    textAlign: 'left',
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
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
