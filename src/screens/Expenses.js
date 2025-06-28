import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { ApiUrl } from '../../config/services'
import { font } from '../components/ThemeStyle'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign';


const UserCard = ({ user, onEdit, onView, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.row}>

      <View style={styles.infoBox}>
        <Text style={styles.name}>{user?.title}</Text>
        <Text>Price: {user?.price}</Text>
        <Text>Expense Made By: {user?.user?.fullName}</Text>
        <Text>Expense Date: {user?.date_for}</Text>
        <Text>Payment Mode: {user?.payment_type}</Text>
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


export default function Expenses() {
  const navigation = useNavigation();
  const [users, setUser] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Expenses',
      headerTitleStyle: { fontSize: 25, fontFamily: font.secondary },
      headerRight: () => {
        return (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.topIcon}>
              <AntDesign name="retweet" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddExpense')}
              style={[styles.topIcon, { marginRight: 12 }]}>
              <AntDesign name="adduser" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation])

  const isFocussed = useIsFocused();
  useEffect(() => {
    fetchExpenses()
  }, [isFocussed])

  const fetchExpenses = async () => {
    try {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
      }
      const response = await axios.put(`${ApiUrl}/api/expenses`, payload);
      console.log(response);
      setUser(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

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
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/expenses/${user}`, {
                data: { db_name: db },
              });
              console.log('Expense deleted successfully');
              fetchExpenses();

              // Optional: refresh list or show success toast
            } catch (error) {
              console.error('Error deleting Expense:', error.message);
              Alert.alert('Error', 'Failed to delete the Expense.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleView = (user) => {
    console.log(user);
    navigation.navigate('ExpenseView', { id: user.id });

  }

  const handleEdit = (id) => {
    console.log(id)
    navigation.navigate('EditExpense', { id: id.id });
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
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onView={handleView}
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
    // flexDirection: 'row',
    // alignItems: 'flex-start',
  },
  sideBox: {
    width: '30%',
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