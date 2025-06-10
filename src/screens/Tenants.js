import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCard = ({user, toggleStatus, onView, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image
         source={{ uri: 'https://www.w3schools.com/w3images/avatar6.png' }}
         style={styles.avatar}
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user.name}</Text>
        <Text>Gender: {user.gender}</Text>
        <Text>Phone: {user.phone}</Text>
        <Text>Room No: {user.room}</Text>
        <Text>Rent: {user.rent}</Text>

        {/* Status with touch */}
        <TouchableOpacity onPress={() => toggleStatus(user.id, user.status)}>
          <Text
            style={[
              styles.status,
              user.status === 'Active' ? styles.active : styles.inactive,
            ]}>
            Status: {user.status}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => onView(user)} style={styles.viewBtn}>
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(user.id)}
        style={styles.deleteBtn}>
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Tenants() {

  useEffect(()=>{
   fetchTenants();
  },[db_name])



const fetchTenants = async () => {
  try {
    const db_name = await AsyncStorage.getItem('db_name');
    setdb(db_name);

    const payload = {
      db_name: db_name,
    };

    const response = await axios.put(`${ApiUrl}/api/tenants/`, payload);
    console.log('API Response:', response.data.data);

    // Transform data to match users state structure
    const transformedUsers = response.data.data.map((tenant) => ({
      id: tenant.id.toString(), // convert to string if needed
      name: tenant.name,
      gender: tenant.gender,
      phone: tenant.phone,
      room: tenant.room ? tenant.room.name : '', // handle possible null
      rent: tenant.rentForRoom.toString(),
      status: tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1), // e.g., "active" -> "Active"
    }));

    setUsers(transformedUsers);
  } catch (error) {
    console.error('Error fetching tenants:', error);
  }
};




  const navigation = useNavigation();

  const [isTableView , setTableView] = useState(false);
  const [page , setPage] = useState(0);
  const [db_name,setdb] = useState('')
  const [users, setUsers] = useState('');

  const ToggleView = () =>{
    setTableView((prev) => {
      if(!isTableView)
      {
        Orientation.lockToLandscape()
      }
      else{
        Orientation.lockToPortrait()
      }
    })
  }

  const handleView = user => {
    console.log('View:', user);
    navigation.navigate('TenantView' , {id:'1'})
  };

  const handleDelete = id => {
    console.log('Delete:', id);
  };

  const toggleStatus = (id, currentStatus) => {
    Alert.alert(
      'Change Status',
      'Select new status',
      [
        {
          text: 'Active',
          onPress: () => updateStatus(id, 'Active'),
        },
        {
          text: 'Inactive',
          onPress: () => updateStatus(id, 'Inactive'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const updateStatus = (id, newStatus) => {
    const updatedUsers = users.map(user =>
      user.id === id ? {...user, status: newStatus} : user,
    );
    setUsers(updatedUsers);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Tenants</Text>
          <View>

          <TouchableOpacity onPress={()=>navigation.navigate('AddTenant')} style={styles.topIcon}>
            <AntDesign name="adduser" size={22} color="#fff" />
          </TouchableOpacity>
          </View>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <UserCard
              user={item}
              toggleStatus={toggleStatus}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginBottom: 10,
    // fontWeight: 'bold',
     fontFamily: font.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
  container: {
    padding: 24,
    // backgroundColor: '#f2f2f2',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sideBox: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    width: '70%',
  },
  name: {
    fontSize: 18,
    // fontWeight: 'bold',
     fontFamily: font.secondary,
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  viewBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    // fontWeight: 'bold',
     fontFamily: font.secondary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    marginTop: 6,
    // fontWeight: 'bold',
     fontFamily: font.secondary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  inactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  topIcon: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#75AB38',
    borderRadius: 10,
  },
     avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
});
