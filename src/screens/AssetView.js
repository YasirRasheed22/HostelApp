import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AssetView() {
  const route = useRoute();
  const { id } = route.params;
  const [user, setUser] = useState()
  console.log('id from view', id);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const payload = {
          db_name: db,
        }
        const response = await axios.put(`${ApiUrl}/api/inventory/single/${id}`, payload);
        console.log(response);
        setUser(response.data)
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchAsset();
  }, [])
  return (
    <ScrollView style={styles.container}>


      <Text style={styles.sectionTitle}>Asset Information</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{user?.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.value}>{user?.quantity}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>sellPrice</Text>
          <Text style={styles.value}>{user?.sellPrice}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Description</Text>
      <View style={styles.card}>
        <Text>{user?.description}</Text>
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

});
