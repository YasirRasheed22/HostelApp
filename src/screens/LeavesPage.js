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
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
        <TouchableOpacity onPress={() => toggleStatus(user.id, user.status)}>
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



export default function LeavePage() {
  const navigation = useNavigation();
  const [counter , setCount] = useState();
  const [users , setUsers] = useState();

  const isFocussed = useIsFocused();


  useEffect(()=>{
    
    fetchRecord();
  },[isFocussed])

  const fetchRecord = async() => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const payload = {
                db_name:db
            }

         const response = await axios.put( `${ApiUrl}/api/leave` , payload);
         console.log(response.data);
         setCount(response.data?.dashboard);
         setUsers(response.data?.leaves);
      } catch (error) {
        console.log(error.message)
      }
    }

  const handlePress = () =>{
    navigation.navigate('ApplyLeave')
  }
  const handleSubmit = (item) => {
    console.log(item)
    navigation.navigate('LeaveList' , {data:item?.data});
  }

   navigation.setOptions({
      headerTitle: 'Leaves',
       headerTitleStyle:{fontSize: 15,fontFamily:font.secondary},
      headerRight:()=>{
                    return(
                     <TouchableOpacity onPress={handlePress}>
                 <AntDesign name="addfile" size={28} color="#4E4E5F" />
                    </TouchableOpacity>
                    );
            } 
    })
  const reports = [
    {label: 'Total Leaves', count: counter?.totalLeaves, icon: 'file-text-o' , data:'all'},
    {label: 'Pending Leaves', count: counter?.pendingLeaves, icon: 'file-text-o' , data:'pending'},
    {label: 'Approved Leaves', count: counter?.approvedLeaves, icon: 'file-text-o' , data:'approved'},
    {label: 'Rejected Leaves', count:counter?.rejectedLeaves, icon: 'file-text-o', data:'rejected'},
  ];


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
      {cancelable: true},
    );
  };

  const updateStatus = async(id, newStatus) => {
   try {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
        status : newStatus
      }
        const response = await axios.put(`${ApiUrl}/api/leave/${id}` , payload)
        console.log(response);
        fetchRecord();


     } catch (error) {
      console.log(error.message)
     }
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
        <View style={styles.cardList}>
          {reports.map((item, index) => (
            <TouchableOpacity onPress={() => handleSubmit(item)} key={index} style={styles.card}>
              <View style={styles.iconWrapper}>
                <View style={styles.icons}>
                  <FontAwesome name={item.icon} size={15} color="#fff" />
                </View>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardCount}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
