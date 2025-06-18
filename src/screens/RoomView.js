import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import axios from 'axios';

export default function RoomView() {
    const route = useRoute();
    const [user , setUser] = useState();
    const {id} = route.params;
    console.log(id)
    useEffect(() => {
  const fetchUser = async () => {
    const db = await AsyncStorage.getItem('db_name');
    const payload = {
        db_name : db
    }
    try {
      const response = await axios.put(`${ApiUrl}/api/rooms/single/${id}`, payload);
      console.log('User fetched:', response.data);
      setUser(response.data);
    } catch (error) {
      console.log('Error fetching user:', error.message);
    }
  };

//   Alert.alert('User ID', id);
  fetchUser();
}, [id]);
    // Alert.alert(id);
  return (
   <ScrollView style={styles.container}>
       
        <Text style={styles.sectionTitle}>Room Information</Text>
  
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Room Name</Text>
            <Text style={styles.value}>{user?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Room Fee</Text>
            <Text style={styles.value}>{user?.per_person}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Room Capacity</Text>
            <Text style={styles.value}>{user?.capacity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Floor Name</Text>
            <Text style={styles.value}>{user?.floor_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tenants</Text>
            <Text style={styles.value}>{user?.tenantCount}</Text>
          </View>
          </View>
         <View style={{}}>
            <Text style={styles.sectionTitle}>Facilities</Text>
             <View style={styles.card}>
            <View>
              {console.log(user?.facilities)}
            {JSON.parse(user?.facilities || '[]').map((item, index) => (
            <Text key={index} style={{ marginRight: 10, marginBottom: 12 }}>
                {`\u2022 ${item}`}
            </Text>
            ))}
        </View>
        </View>
            </View>

        
        
        {/* <Text style={styles.sectionTitle}>Property Information</Text> */}
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