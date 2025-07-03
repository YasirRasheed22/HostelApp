import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {font} from '../components/ThemeStyle';
import {ApiUrl} from '../../config/services';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoomCard = ({user, onView, onDelete, onEdit}) => (
   <TouchableWithoutFeedback onPress={() => onView(user)}>
  <View style={styles.card}>
    <View style={styles.row}>
      {/* <View style={styles.sideBox}>
        <Image
          source={{uri: 'https://www.w3schools.com/w3images/avatar6.png'}}
          style={styles.avatar}
        />{' '}
      </View> */}
      <View style={styles.infoBox}>
        <Text>Room Name: {user.RoomName}</Text>
        <Text>Floor No. {user.floorName}</Text>
        {/* <Text>Capacity: {user.capacity}</Text> */}
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
    {/* <View style={styles.buttonContainer}>
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
    </View> */}
  </View>
  </TouchableWithoutFeedback>
);
export default function Rooms() {
  const navigation = useNavigation();

  const [rooms, setRooms] = useState();
  const [refreshKey, setRefreshKey] = useState();
  const route = useRoute();
    const [loading , setLoading] = useState(true)

  const {data} = route.params;
  console.log('props data', data);

  useLayoutEffect(()=>{
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

  },[navigation])

  let url = '';
  if (data === 'All Rooms') {
    url = `${ApiUrl}/api/rooms`;
  } else if (data === 'Vacant Rooms') {
    url = `${ApiUrl}/api/rooms/vacant-room`;
  } else if (data === 'Filled Rooms') {
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
      }finally{
        setLoading(false)
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
              setLoading(true)
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/rooms/${id}`, {
                data: {db_name: db},
              });
              console.log('Room deleted successfully');
              setRefreshKey(prev => prev + 1);
            } catch (error) {
              console.error('Error deleting room:', error.message);
              Alert.alert('Error', 'Failed to delete the room.');
            }finally{
              setLoading(false)
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
 container: {
  flex: 1,
  paddingVertical: 20,
  paddingHorizontal: 12, // reduced padding for better layout with shadow
  backgroundColor: '#F9F9F9',
},

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  marginHorizontal: 8, // Add horizontal margin to prevent cut-off shadows
  elevation: 5, // For Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
},

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBox: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: font.secondary,
    color: '#333',
    marginBottom: 6,
  },
  status: {
    marginTop: 10,
    fontFamily: font.secondary,
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
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
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
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
  EditBtn: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  btnText: {
    color: 'white',
    fontFamily: font.secondary,
  },
});
