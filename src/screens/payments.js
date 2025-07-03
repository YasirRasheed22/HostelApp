import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ApiUrl } from '../../config/services'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';



const UserCard = ({user, onEdit, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
    
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user?.bank_name || user?.type}</Text>
        <Text>Account Title: {user?.account_title}</Text>
        <Text>Account Number: {user?.account_number}</Text>
      </View>
    </View>
    <View style={styles.buttonContainer}>
      
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



export default function Payments() {

    const navigation = useNavigation();
    const [users , setUsers] = useState();
      const [loading , setLoading] = useState(true)


    useLayoutEffect(()=>{
       navigation.setOptions({
      headerTitle: 'Payments',
      headerTitleStyle: {fontSize: 20, fontFamily: font.secondary},
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row'}}>
            {/* <TouchableOpacity  style={styles.topIcon}>
              <AntDesign name="retweet" size={22} color="#fff" />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('AddPayment')}
              style={[styles.topIcon, {marginRight: 12}]}>
              <AntDesign name="adduser" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      },
    });
    },[navigation])
    const isFocused = useIsFocused();
    useEffect(()=>{
    
     fetchAttendence();
    },[isFocused])

     const fetchAttendence = async() => {
        try {
            const db  = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name:db
            }

            const response = await axios.put(`${ApiUrl}/api/payment`, payload);
            console.log(response.data);
            setUsers(response.data?.payments)
        } catch (error) {
            console.log(error.message)
        }finally{
          setLoading(false);
        }
     };

    const handleEdit=(user)=>{
        console.log(user);
        navigation.navigate('EditPayment' , {id : user.id})
    }
    const handleDelete = async (user) => {
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
              await axios.delete(`${ApiUrl}/api/payment/${user}`, {
                data: {db_name: db},
              });
              console.log('Payment deleted successfully');
              fetchAttendence();
              
              // Optional: refresh list or show success toast
            } catch (error) {
              console.error('Error deleting Payment:', error.message);
              Alert.alert('Error', 'Failed to delete the Payment.');
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
           {/* {isTableView ? (
             <DataTable>
               <DataTable.Header>
                 <DataTable.Title>Title</DataTable.Title>
                 <DataTable.Title>Sell Price</DataTable.Title>
                 <DataTable.Title>Quantity</DataTable.Title>
               </DataTable.Header>
               {users
                 .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
                 .map(item => (
                   <DataTable.Row key={item.id}>
                     <DataTable.Cell>{item.title}</DataTable.Cell>
                     <DataTable.Cell>{item.sellPrice}</DataTable.Cell>
                     <DataTable.Cell>{item.quantity}</DataTable.Cell>
                    
                   </DataTable.Row>
                 ))}
             </DataTable>
           ) : ( */}
             <FlatList
               data={users}
               keyExtractor={item => item.id}
               renderItem={({item}) => (
                 <UserCard
                   user={item}
                   onDelete={handleDelete}
                   onEdit={handleEdit}
                 />
               )}
             />
           {/* )} */}
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

   