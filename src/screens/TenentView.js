import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { use, useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TenentView() {
 const route = useRoute();
  const { id } = route.params;

 useEffect(() => {
  const fetchUser = async () => {
    const db = await AsyncStorage.getItem('db_name') || 'lahore_hostel';
    const payload = {
        db_name : 'lahore_hostel'
    }
    try {
      const response = await axios.post(`${ApiUrl}/api/tenants/single/${id}`, payload);
      console.log('User fetched:', response.data);
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
          <Text style={styles.value}>Female</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>CNIC/B-FORM</Text>
          <Text style={styles.value}>55149-6549649-6</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>654@mail.com</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>14 Jan 2025</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>Female</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Filing Status</Text>
          <Text style={styles.value}>Single</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>Johar Town</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>State</Text>
          <Text style={styles.value}>Punjab</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Job Information</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Job Title</Text>
          <Text style={styles.value}>Teacher</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Job Location</Text>
          <Text style={styles.value}>Lahore Pakistan</Text>
        </View>
      </View>


      <Text style={styles.sectionTitle}>Room Information</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Room Name</Text>
          <Text style={styles.value}>B-86</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Room Fee</Text>
          <Text style={styles.value}>7000</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Security Fee</Text>
          <Text style={styles.value}>7000</Text>
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