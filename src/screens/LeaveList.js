import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { font } from '../components/ThemeStyle';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';



const UserCard = ({ user, toggleStatus, onEdit, onDelete }) => (
  <View style={styles.userCard}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image source={{ uri: user?.user?.profile_image || user?.tenant?.profile_image }} style={styles.avatar} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user?.user?.fullName || user?.tenant?.name}</Text>
        <Text>Leave Date: {user?.leave_date}</Text>
        <TouchableOpacity >
          <Text
            style={[
              styles.status,
              user.status === 'approved' ? styles.active : styles.inactive,
            ]}>
            Status: {user.status}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.buttonContainer}>

      <TouchableOpacity onPress={() => onEdit(user)} style={styles.editBtn}>
        <Text style={styles.btnText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(user.id)} style={styles.deleteBtn}>
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);



export default function LeaveList() {
  const navigation = useNavigation();
  const [counter, setCount] = useState();
  const [users, setUsers] = useState();
  const route = useRoute();
  const { data } = route.params;
  console.log(data);

  let url = `${ApiUrl}/api/leave`

  if (data === 'pending') {
    url = `${ApiUrl}/api/leave/status/pending`
  } else if (data === 'approved') {
    url = `${ApiUrl}/api/leave/status/approved`
  } else if (data === 'rejected') {
    url = `${ApiUrl}/api/leave/status/rejected`
  }
  else {
    url = `${ApiUrl}/api/leave`
  }

  useEffect(() => {
   
    fetchRecord();
  }, [])

   const fetchRecord = async () => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const payload = {
          db_name: db
        }

        const response = await axios.put(url, payload);
        console.log(response.data);
        setCount(response.data?.dashboard);
        setUsers(response.data?.leaves);
      } catch (error) {
        console.log(error.message)
      }
    }


  const handlePress = () => {
    navigation.navigate('ApplyLeave')
  }
  const handleSubmit = (item) => {
    console.log(item)
    navigation.navigate('AttendenceList', { data: item?.data });
  }

  navigation.setOptions({
    headerTitle: `${data} Leaves`,
    headerTitleStyle: { fontSize: 15, fontFamily: font.secondary },
    headerRight: () => {
      return (
        <TouchableOpacity onPress={handlePress}>
          <AntDesign name="addfile" size={28} color="#4E4E5F" />
        </TouchableOpacity>
      );
    }
  })


  const toggleStatus = (id, currentStatus) => {
    Alert.alert(
      'Change Status',
      'Select new status',
      [
        {
          text: 'Approved',
          onPress: () => updateStatus(id, 'approved'),
        },
        {
          text: 'Rejected',
          onPress: () => updateStatus(id, 'rejected'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const updateStatus = (id, newStatus) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user,
    );
    setUsers(updatedUsers);
  };



  const handleEdit = (user) => {
console.log("on edit click" ,user)
navigation.navigate('EditLeave' , {id: user?.id})
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
              await axios.delete(`${ApiUrl}/api/leave/${id}`, {
                data: {db_name: db},
              });
              console.log('Leave deleted successfully');
              fetchRecord();
            } catch (error) {
              console.error('Error deleting Leave:', error.message);
              Alert.alert('Error', 'Failed to delete the Leave.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexGrow: 1 }}>
          <FlatList
            data={users}
            keyExtractor={item => item.id?.toString()}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                toggleStatus={toggleStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No users found.</Text>}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    padding: 24,
  },
  cardList: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '48%',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    width: '70%',
  },
  cardTitle: {
    color: '#7CB33D',
    fontSize: 13,
    fontFamily: font.secondary,
  },
  cardCount: {
    color: '#7CB33D',
    fontSize: 13,
    fontFamily: font.secondary,
    marginTop: 4,
  },
  icons: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#75AB38',
  },
  userCard: {
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontFamily: font.secondary,
    marginBottom: 6,
  },
  status: {
    marginTop: 6,
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
  editBtn: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  btnText: {
    color: 'white',
    fontFamily: font.secondary,
  },
});
