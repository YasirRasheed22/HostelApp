import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, Linking } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StaffView() {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation()
    const [loading , setLoading] = useState(true)

  const [user, setUser] = useState();
  const [rights, setRights] = useState({});

  console.log(id);

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

  const handleDelete = async() => {
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
              await axios.delete(`${ApiUrl}/api/users/${id}`, {
                data: {db_name: db},
              });
              console.log('Staff deleted successfully');
              navigation.goBack()
              // Optional: refresh list or show success toast
            } catch (error) {
              console.error( error.message);
              Alert.alert('Error', 'Failed to delete Member.');
            }finally{
              setLoading(false)
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  const handleEdit = () => {
    console.log('Edit:', id);
    navigation.navigate('EditStaff', {id:id})
  };
  const isFocused = useIsFocused()
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
      }finally{
        setLoading(false)
      }
    };

    fetchstaff();
  }, [id , isFocused]);

  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

  

  return (
    <ScrollView style={styles.container}>

      <View style={styles.imageContainer}>
        <Image source={{ uri: user?.profile_image }} style={styles.roundImage} />
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
          <Text onPress={()=>{Linking.openURL(`tel:${user?.phone}`)}} style={[styles.value , {color: 'blue'}]}>{user?.phone}</Text>
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
      <View style={[styles.card , {marginBottom:50}]}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Access Rights:</Text>
          <View style={styles.rightsContainer}>
            {rights &&
              Object.entries(rights).map(([key, value]) => (
                <View key={key} style={styles.rightsRow}>
                  <Text style={styles.rightLabel}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  <Text style={[styles.rightStatus, { color: value ? 'green' : 'red' }]}>
                    {value ? 'Enabled ✅' : 'Disabled ❌'}
                  </Text>
                </View>
              ))}
          </View>

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
  rightsContainer: {
    marginTop: 10,
  },
  rightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  rightLabel: {
    fontWeight: '500',
    color: '#444',
  },
  rightStatus: {
    fontWeight: '600',
  },

});
