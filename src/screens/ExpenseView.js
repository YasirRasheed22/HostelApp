import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ExpenseView() {
    const [user , setUser] = useState();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const {id} = route.params;
    console.log(id);
    const navigation = useNavigation();



     useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.buttonContainer, styles.editButton]}>
            <Text style={styles.buttonText}><FontAwesome name='pencil' /></Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.buttonContainer, styles.deleteButton]}>
            <Text style={styles.buttonText}><AntDesign name='delete' /></Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation])

  const handleDelete = async () => {
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
              await axios.delete(`${ApiUrl}/api/expenses/${id}`, {
                data: { db_name: db },
              });
              console.log('Expense deleted successfully');
              // fetchExpenses();
                navigation.goBack()
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


  const handleEdit = () => {
    console.log(id)
    navigation.navigate('EditExpense', { id: id });
  }

function formatToPakistaniCurrency(amount) {
  return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
  }).format(amount);
}

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
            }finally{
              setLoading(false);
            }
        }
        fetchExpense();
    },[])

      if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

  


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
            <Text style={styles.value}>{formatToPakistaniCurrency(user?.price)}</Text>
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
     buttonContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  }, headerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50', // Green
  },
  deleteButton: {
    backgroundColor: '#F44336', // Red
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: 'green',
      marginBottom: 8,
    },
      loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
  