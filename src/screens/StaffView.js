import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StaffView() {
  const route = useRoute();
  const {id} = route.params;
  const [user, setUser] = useState();
  const [rights, setRights] = useState({});

  console.log(id);

   

  useEffect(() => {
    const fetchstaff = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
      };
      try {
        const response = await axios.put(
          `${ApiUrl}/api/users/single/${id}`,
          payload,
        );
        console.log(response.data);
       const rights = response.data?.users?.rights; // ✅ already an object
        // console.log(rights);
        setRights(rights);
        setUser(response.data?.users);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchstaff();
  }, [id]);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.imageContainer}>
        <Image source={{uri: user?.profile_image}} style={styles.roundImage} />
      </View>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user?.fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>CNIC/B-FORM</Text>
          <Text style={styles.value}>{user?.cnic}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user?.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Emergency Contact</Text>
          <Text style={styles.value}>{user?.emergency_contact}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Salary</Text>
          <Text style={styles.value}>{user?.salary}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Cycle</Text>
          <Text style={styles.value}>{user?.payout_date}</Text>
        </View>
      </View>
       <Text style={styles.sectionTitle}>Rights Information</Text>
      <View style={styles.card}>
       <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Access Rights:</Text>
          {rights && Object.entries(rights).map(([key, value]) => (
            <Text key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value ? 'True' : 'False'}
            </Text>
          ))}
        </View>
      </View>

    </ScrollView>
  );
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
  roundImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#75AB38',
  },
    imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
