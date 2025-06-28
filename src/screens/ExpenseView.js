import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import { useRoute } from '@react-navigation/native';

export default function ExpenseView() {
    const [user , setUser] = useState();
    const route = useRoute();
    const {id} = route.params;
    console.log(id);

    useEffect(()=>{
        const fetchExpense = async() => {
            try {
                const db = await AsyncStorage.getItem('db_name');
                const payload = {
                    db_name : db,
                }
                const response = await axios.put(`${ApiUrl}/api/expenses/${id}` , payload);
                console.log(response);
                setUser(response.data?.data)
                
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchExpense();
    },[])
    return(
   <ScrollView style={styles.container}>  
        <Text style={styles.sectionTitle}>Expense Information</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{user?.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>{user?.price}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{user?.date_for}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Type:</Text>
            <Text style={styles.value}>{user?.payment_type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expense Made By:</Text>
            <Text style={styles.value}>{user?.user?.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expense Type:</Text>
            <Text style={styles.value}>{user?.expense_type}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.card}>
          <Text>{user?.description}</Text>
        </View>
      </ScrollView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: 'green',
      marginBottom: 8,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      elevation: 2,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    label: {
      fontWeight: 'bold',
      color: '#333',
    },
    value: {
      color: '#444',
    },
  
  });
  