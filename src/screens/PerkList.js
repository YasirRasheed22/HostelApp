import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ApiUrl } from '../../config/services'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';


const formatDate = (dateStr) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // e.g., "25 Jun 2025"
};


const UserCard = ({user, onEdit, onView, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
    
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user?.title}</Text>
        <Text>Price: {user?.price}</Text>
        <Text>Implement Date: {formatDate(user?.updatedAt)}</Text>
        <Text>Status: {user?.status}</Text>
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

export default function PerkList() {
 const navigation = useNavigation();
  const [users , setUser] = useState([]);
useLayoutEffect(()=>{
       navigation.setOptions({
      headerTitle: 'Perk List',
      headerTitleStyle: {fontSize: 25, fontFamily: font.secondary},
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity  style={styles.topIcon}>
              <AntDesign name="retweet" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddPerk')}
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
     const fetchAttendence = async() => {
        try {
            const db  = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name:db
            }

            const response = await axios.put(`${ApiUrl}/api/fees/perks`, payload);
            console.log(response.data);
            setUser(response.data?.perk);
        } catch (error) {
            console.log(error.message)
        }
     };
     fetchAttendence();
    },[isFocused])

    const handleEdit=(user)=>{
        console.log(user);
    }
    const handleDelete=(user)=>{
        console.log(user);
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
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      infoBox: {
        width: '100%',
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
    