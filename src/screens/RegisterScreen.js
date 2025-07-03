import {
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {font} from '../components/ThemeStyle'; // Make sure this is correctly defined
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AlertModal from '../components/CustomAlert';

export default function RegisterScreen() {
  // const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
    const [loading , setLoading] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  const navigation = useNavigation();

  const handleRegister = async() => {
    if (password !== confirmPassword) {
       setModalType('danger');
        setModalMessage('Passwords do not match');
        setModalVisible(true);
      return;
    }

    try {
      setLoading(true)
      const payload = {
        business_name : businessName,
        email : email,
        password : password,
      }

      const response = await axios.post(`${ApiUrl}/api/helper/register-first` , payload);

      console.log(response);
       setModalType('success');
        setModalMessage('Business Registered Successfully Wait for Admin Approval');
        setModalVisible(true);
      setEmail('');
      setPassword('');
      setBusinessName('');
      setConfirmPassword('');
      
    } catch (error) {
      console.log(error.message)
        setModalType('danger');
        setModalMessage('Validation Error');
        setModalVisible(true);
    }finally{
      setLoading(false)
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
       <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

             <Image
                  source={require('../assets/profile-9.webp')}
                  style={styles.logo}
              />
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Signup to Hotel Management System
          </Text>

          <TextInput
            placeholder="Business Name"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={text => setEmail(text.toLowerCase())}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
         
         

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Already have an account? Login
          </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
  logo: {
  width: 120,
  height: 120,
  resizeMode: 'contain',
  alignSelf: 'center',
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
    fontFamily: font.secondary,
    fontSize: 16,
  },
  linkText: {
    color: '#4f46e5',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: font.secondary,
  },
});
