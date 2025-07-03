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
  <View style={styles.card2}>
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
  
    const [loading , setLoading] = useState(true)


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
      }finally{
        setLoading(false);
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
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: font.secondary,
    color: '#4E4E5F',
    marginBottom: 12,
  },

  // Summary Cards
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#75AB38',
    marginRight: 12,
  },
  icons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#7CB33D',
    fontFamily: font.secondary,
  },
  cardCount: {
    fontSize: 13,
    fontFamily: font.secondary,
    color: '#7CB33D',
    marginTop: 4,
  },

  // Report List Card
  container2: {
    marginTop: 20,
  },
  card2: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoBox: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 17,
    fontFamily: font.secondary,
    color: '#333',
    marginBottom: 6,
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  viewBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    fontFamily: font.secondary,
    fontSize: 14,
  },
});
