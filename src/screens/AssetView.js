import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AssetView() {
  const route = useRoute();
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState()
  console.log('id from view', id);
const navigation = useNavigation();
   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.buttonContainer, styles.editButton]}>
            <Text style={styles.buttonText}><FontAwesome name='pencil' /></Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.buttonContainer, styles.deleteButton]}>
            <Text style={styles.buttonText}><AntDesign name='delete' /></Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation])


  const isFocused = useIsFocused()
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
      }finally{
        setLoading(false);
      }
    }

    fetchAsset();
  }, [isFocused])

  function formatToPakistaniCurrency(amount) {
  return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
  }).format(amount);
}

   const handleEdit=()=>{
        console.log(user);
        navigation.navigate('EditAsset' ,{id: id})
    }
     const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/inventory/${id}`, {
                data: {db_name: db},
              });
              console.log('Asset deleted successfully');
              fetchAsset()
            } catch (error) {
              console.error('Error deleting Asset:', error.message);
              Alert.alert('Error', 'Failed to delete the Asset.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

    if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }
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
          <Text style={styles.value}>{formatToPakistaniCurrency(user?.sellPrice)}</Text>
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
   buttonContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  }, headerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50', // Green
  },
  deleteButton: {
    backgroundColor: '#F44336', // Red
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },

});
