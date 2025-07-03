import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../components/CustomAlert';

export default function OrganizationProfile() {
  const [viewMode, setViewMode] = useState(true);
  const [id , setId] = useState();
  const [db , setDb] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
    const [loading , setLoading] = useState(true)


  useEffect(()=>{
    const fetchSettings = async() => {
        const db_name = await AsyncStorage.getItem('db_name');
        setDb(db_name);
        const payload = {
            db_name : db_name
        }
        try {
            const response = await axios.put(`${ApiUrl}/api/setting`, payload);
            console.log(response);
            console.log(response.data?.settings?.id);
            setData(response.data?.settings)
            setId(response.data?.settings?.id)
        } catch (error) {
            console.log(error.message)
        }finally{
          setLoading(false)
        }
    }

    fetchSettings();
  },[])

  const [data, setData] = useState({
    organization_name: '',
    organization_location: '',
    organization_phone: '',
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_phone_number: '',
    twilio_verification: true,
    db_name: ''
  });

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePress = async () => {
    setLoading(true)
    const payload = {
        organization_name: data.organization_name,
        organization_location: data.organization_location,
        organization_phone: data.organization_phone,
        twilio_account_sid: data.twilio_account_sid,
        twilio_auth_token: data.twilio_auth_token,
        twilio_phone_number: data.twilio_phone_number,
        db_name: db,
        id:id
    }
    try {
      console.log("Submitting payload:", payload);
      const response  = await axios.post(`${ApiUrl}/api/setting` , payload);
      console.log(response);
      setModalType('success');
        setModalMessage('Changes Submitted');
        setModalVisible(true);
    } catch (error) {
      console.log(error.message);
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
    <ScrollView contentContainerStyle={styles.container}>
       <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
      <Text style={styles.sectionTitle}>Organization Information</Text>

      <View style={styles.row}>
        {viewMode ? (
          <>
            <Text style={styles.label}>Organization Name</Text>
            <Text style={styles.text}>{data.organization_name}</Text>

            <Text style={styles.label}>Organization Location</Text>
            <Text style={styles.text}>{data.organization_location}</Text>

            <Text style={styles.label}>Organization Phone</Text>
            <Text style={styles.text}>{data.organization_phone}</Text>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={data.organization_name}
              onChangeText={text => handleChange('organization_name', text)}
              placeholder="Organization Name"
            />
            <TextInput
              style={styles.input}
              value={data.organization_location}
              onChangeText={text => handleChange('organization_location', text)}
              placeholder="Organization Location"
            />
            <TextInput
              style={styles.input}
              value={data.organization_phone}
              onChangeText={text => handleChange('organization_phone', text)}
              placeholder="Organization Phone"
            />
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Twilio Information</Text>

      <View style={styles.row}>
        {viewMode ? (
          <>
            <Text style={styles.label}>Account SID</Text>
            <Text style={styles.text}>{data.twilio_account_sid}</Text>

            <Text style={styles.label}>Auth Token</Text>
            <Text style={styles.text}>{data.twilio_auth_token}</Text>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={data.twilio_account_sid}
              onChangeText={text => handleChange('twilio_account_sid', text)}
              placeholder="Account SID"
            />
            <TextInput
              style={styles.input}
              value={data.twilio_auth_token}
              onChangeText={text => handleChange('twilio_auth_token', text)}
              placeholder="Auth Token"
            />
          </>
        )}
      </View>

      <View>
        {viewMode ? (
          <>
            <Text style={styles.label}>Twilio Phone Number</Text>
            <Text style={styles.text}>{data.twilio_phone_number}</Text>
          </>
        ) : (
          <TextInput
            style={styles.input}
            value={data.twilio_phone_number}
            onChangeText={text => handleChange('twilio_phone_number', text)}
            placeholder="Twilio Phone Number"
          />
        )}
      </View>

      {!viewMode && (
        <View style={styles.btn}>
          <Button
            title="Save Changes"
            onPress={handlePress}
            color="#75AB38"
          />
        </View>
      )}

      <Button
        title={viewMode ? 'Edit Mode' : 'View Mode'}
        onPress={() => setViewMode(prev => !prev)}
        color="#75AB38"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75AB38',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  text: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  btn: {
    marginBottom: 20,
    marginTop: 20,
  },
});
