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
// import AntDesign from 'react-native-vector-icons/AntDesign';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import {font} from '../components/ThemeStyle';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataTable} from 'react-native-paper';

const UserCard = ({user, toggleStatus, onEdit, onView, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image
          source={{uri: user.image}}
          style={[styles.avatar, {objectFit: 'cover'}]}
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
      <TouchableOpacity onPress={() => onEdit(user)} style={styles.EditBtn}>
        <Text style={styles.btnText}>Edit</Text>
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
  const navigation = useNavigation();

  const ToggleView = () => {
    setTableView(prev => {
      if (!prev) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      return !prev;
    });
  };

  navigation.setOptions({
    headerTitle: 'Tenants',
    headerTitleStyle: {fontSize: 25, fontFamily: font.secondary},
    headerRight: () => {
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={ToggleView} style={styles.topIcon}>
            <AntDesign name="retweet" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTenant')}
            style={[styles.topIcon, {marginRight: 12}]}>
            <AntDesign name="adduser" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    },
  });

  const isFocused = useIsFocused();
  useEffect(() => {
    fetchTenants();
  }, [db_name, isFocused]);

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
      const transformedUsers = response.data.data.map(tenant => ({
        id: tenant.id.toString(), // convert to string if needed
        name: tenant.name,
        gender: tenant.gender,
        image: tenant.profile_image,
        phone: tenant.phone,
        room: tenant.room ? tenant.room.name : '', // handle possible null
        rent: tenant.rentForRoom.toString(),
        status: tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1), // e.g., "active" -> "Active"
      }));

      setUsers(transformedUsers.reverse());
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const [isTableView, setTableView] = useState(false);
  const [page, setPage] = useState(0);
  const [db_name, setdb] = useState('');
  const [users, setUsers] = useState('');

  const itemsPerPage = 5;

  const handleView = user => {
    console.log('User ID:', user.id); // Log the ID to verify
    navigation.navigate('TenantView', {id: user.id});
  };
  const handleEdit = user => {
    console.log('User ID from edit view:', user.id);
    navigation.navigate('EditTenant', {id: user.id});
  };

  const handleDelete = async id => {
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
              await axios.delete(`${ApiUrl}/api/tenants/${id}`, {
                data: {db_name: db},
              });
              console.log('Tenant deleted successfully');
              fetchTenants();
              // Optional: refresh list or show success toast
            } catch (error) {
              console.error('Error deleting room:', error.message);
              Alert.alert('Error', 'Failed to delete the room.');
            }
          },
        },
      ],
      {cancelable: true},
    );
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
        {/* <View style={styles.titleRow}>
          <Text style={styles.title}>Tenants</Text>
          <View>

          <TouchableOpacity onPress={()=>navigation.navigate('AddTenant')} style={styles.topIcon}>
            <AntDesign name="adduser" size={22} color="#fff" />
          </TouchableOpacity>
          </View>
        </View> */}
        {/* <View style={styles.separator} /> */}
        {isTableView ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title>
              <DataTable.Title>gender</DataTable.Title>
              <DataTable.Title>Room</DataTable.Title>
              <DataTable.Title>Rent</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            {users
              .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
              .map(item => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.phone}</DataTable.Cell>
                  <DataTable.Cell>{item.gender}</DataTable.Cell>
                  <DataTable.Cell>{item.room}</DataTable.Cell>
                  <DataTable.Cell>{item.rent}</DataTable.Cell>
                  <DataTable.Cell>{item.status}</DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <UserCard
                user={item}
                toggleStatus={toggleStatus}
                onView={handleView}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          />
        )}
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
    marginLeft: 10,
  },
  EditBtn: {
    backgroundColor: 'gray',
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
    marginLeft: 10,
    backgroundColor: '#75AB38',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
});
