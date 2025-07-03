import { View, Text, Alert, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

export default function RoomView() {
  const route = useRoute();
  const navigation = useNavigation()
  const [user, setUser] = useState();
  const { id } = route.params;
  const [loading, setLoading] = useState(true)

  console.log(id)

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

  const isFocused = useIsFocused();
  useEffect(() => {


    //   Alert.alert('User ID', id);
    fetchUser();
  }, [id, isFocused]);
  const fetchUser = async () => {
    const db = await AsyncStorage.getItem('db_name');
    const payload = {
      db_name: db
    }
    try {
      const response = await axios.put(`${ApiUrl}/api/rooms/single/${id}`, payload);
      console.log('User fetched:', response.data);
      setUser(response.data);
    } catch (error) {
      console.log('Error fetching user:', error.message);
    } finally {
      setLoading(false)
    }
  };
  // Alert.alert(id);
  const handleEdit = () => {
    console.log('User ID from edit view:', id);
    navigation.navigate('EditRoom', { id: id });
  };

  const handleDelete = id => {
    console.log('Delete:', id);
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
              setLoading(true)
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/rooms/${id}`, {
                data: { db_name: db },
              });
              console.log('Room deleted successfully');
              fetchUser()
            } catch (error) {
              console.error('Error deleting room:', error.message);
              Alert.alert('Error', 'Failed to delete the room.');
            } finally {
              setLoading(false)
            }
          },
        },
      ],
      { cancelable: true },
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  value: {
    color: '#444',
  },
})