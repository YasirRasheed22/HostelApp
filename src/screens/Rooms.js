import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {font} from '../components/ThemeStyle';
import {ApiUrl} from '../../config/services';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoomCard = ({user, onView, onDelete, onEdit}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      {/* <View style={styles.sideBox}>
        <Image
          source={{uri: 'https://www.w3schools.com/w3images/avatar6.png'}}
          style={styles.avatar}
        />{' '}
      </View> */}
      <View style={styles.infoBox}>
        <Text>Floor No. {user.floorName}</Text>
        <Text>Room Name: {user.RoomName}</Text>
        <Text>Capacity: {user.capacity}</Text>
        <Text>Tenants : {user.Tenants}</Text>
        <Text
          style={[
            styles.status,
            user.status === 'Available' ? styles.active : styles.inactive,
          ]}>
          Status: {user.status}
        </Text>
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
export default function Rooms() {
  const navigation = useNavigation();

  const [rooms, setRooms] = useState();
  const [refreshKey, setRefreshKey] = useState();
  const route = useRoute();
  const {data} = route.params;
  console.log('props data', data);

  navigation.setOptions({
    headerTitle: `${data}`,
    headerTitleStyle: {fontSize: 15, fontFamily: font.secondary},
    headerRight: () => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRoom')}
          style={styles.topIcon}>
          <AntDesign name="adduser" size={22} color="#fff" />
        </TouchableOpacity>
      );
    },
  });

  let url = '';
  if (data === 'AllRoom') {
    url = `${ApiUrl}/api/rooms`;
  } else if (data === 'VacantRoom') {
    url = `${ApiUrl}/api/rooms/vacant-room`;
  } else if (data === 'FilledRoom') {
    url = `${ApiUrl}/api/rooms/filled-room`;
  }

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchRoom = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
      };
      try {
        console.log('url...', url);
        const response = await axios.put(`${url}`, payload);
        console.log(response.data);
        const mappedRooms = response.data.data.map(room => ({
          id: room.id,
          floorName: room.floor_name,
          RoomName: room.name,
          capacity: room.capacity,
          Tenants: room.tenantCount,
          status: room.tenantCount >= room.capacity ? 'Occupied' : 'Available',
        }));

        setRooms(mappedRooms);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRoom();
  }, [url, isFocused, refreshKey]);
  console.log(url);

  const handleView = user => {
    console.log('View:', user);
    navigation.navigate('RoomView', {id: user.id});
  };

  const handleEdit = user => {
    console.log('User ID from edit view:', user.id);
    navigation.navigate('EditRoom', {id: user.id});
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
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/rooms/${id}`, {
                data: {db_name: db},
              });
              console.log('Room deleted successfully');
              setRefreshKey(prev => prev + 1);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <View style={styles.titleRow}>
          <Text style={styles.title}>Rooms</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddRoom')}
            style={styles.topIcon}>
            <AntDesign name="adduser" size={22} color="#fff" />
          </TouchableOpacity>
        </View> */}
        {/* <View style={styles.separator} /> */}
        <FlatList
          data={rooms}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <RoomCard
              user={item}
              onView={handleView}
              onDelete={handleDelete}
              onEdit={handleEdit}
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
  EditBtn: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
});
