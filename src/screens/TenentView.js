import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TenentView() {
 const route = useRoute();
  const { id } = route.params;
  const [user, setUser] = useState([])

 useEffect(() => {
  const fetchUser = async () => {
    const db = await AsyncStorage.getItem('db_name');
    const payload = {
        db_name : db
    }
    try {
      const response = await axios.post(`${ApiUrl}/api/tenants/single/${id}`, payload);
      console.log('User fetched:', response.data.tenant);
      setUser(response.data.tenant);
    } catch (error) {
      console.log('Error fetching user:', error.message);
    }
  };

//   Alert.alert('User ID', id);
  fetchUser();
}, [id]);


  return (
   <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>CNIC/B-FORM</Text>
          <Text style={styles.value}>{user.cnic}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{user.dob}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{user.gender}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Filing Status</Text>
          <Text style={styles.value}>{user.marital_status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{user.permanent_address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>State</Text>
          <Text style={styles.value}>{user.state}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Job Information</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Job Title</Text>
          <Text style={styles.value}>{user.job_title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Job Location</Text>
          <Text style={styles.value}>{user.job_location}</Text>
        </View>
      </View>


      <Text style={styles.sectionTitle}>Room Information</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Room Name</Text>
          <Text style={styles.value}>{user.room?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Room Fee</Text>
          <Text style={styles.value}>{user.rentForRoom}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Security Fee</Text>
          <Text style={styles.value}>{user.securityFees}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Property Information</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          {/* <Text style={styles.label}>Property Name</Text>
          <Text style={styles.value}>{user.room?.name}</Text> */}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
     container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#444',
  },
})