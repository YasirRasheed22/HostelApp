import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentCard = ({payment, onView, onDelete, isReceived}) => (
  <TouchableWithoutFeedback onPress={() => onView(payment)}>
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image
          source={{ uri: payment.tenants?.profile_image || 'https://www.w3schools.com/w3images/avatar6.png' }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{payment.tenants?.name}</Text>
        <Text>Phone: {payment.tenants?.phone}</Text>
        {isReceived ? (
          <>
            <Text>Amount: Rs. {payment.amount}</Text>
            <Text>Payment Date: {formatDate(payment.payment_date)}</Text>
            <Text style={[
              styles.status,
              payment.status === 'paid' ? styles.active : styles.inactive,
            ]}>
              Status: {payment.status.toUpperCase()}
            </Text>
          </>
        ) : (
          <>
            <Text>Due Amount: Rs. {payment.amount}</Text>
            <Text>Due Date: {formatDate(payment.due_date)}</Text>
             <Text style={[
              styles.status,
              payment.status === 'unpaid' ? styles.inactive : styles.inactive,
            ]}>
              Status: {payment.status.toUpperCase()}
            </Text>
          </>
        )}
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => onView(payment)} style={styles.viewBtn}>
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
      {isReceived && (
        <TouchableOpacity
          onPress={() => onDelete(payment.id)}
          style={styles.deleteBtn}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
  </TouchableWithoutFeedback>
);

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function Amount() {
  const navigation = useNavigation();
  const route = useRoute();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReceived, setIsReceived] = useState(false);

  useEffect(() => {
    // Check route params to determine which data to fetch
    if (route.params?.data === 'ReceivedAmount') {
      setIsReceived(true);
      fetchReceivedPayments();
    } else if (route.params?.data === 'ReceivableAmount') {
      setIsReceived(false);
      fetchReceivablePayments();
    }

    refreshData()
  }, [route.params]);

  const fetchReceivedPayments = async () => {
    const db = await AsyncStorage.getItem('db_name');
    const payload = { db_name: db };
    
    try {
      setLoading(true);
      const response = await axios.put(`${ApiUrl}/api/fees/received-fee`, payload);
      const data = response.data;
      console.log(data);
      
      if (data.message === "Fees fetched successfully") {
        setPayments(data.data);
        setLoading(false);
      } else {
        setError('Failed to fetch received payments');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceivablePayments = async () => {
    const db = await AsyncStorage.getItem('db_name');
    const payload = { db_name: db };
    
    try {
      setLoading(true);
      const response = await axios.put(`${ApiUrl}/api/fees/receivable-fee`, payload);
      const data = response.data;
      console.log(data)
      
      if (data.message === "Fees fetched successfully") {
        setPayments(data.data);
      } else {
        setError('Failed to fetch receivable payments');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (isReceived) {
      fetchReceivedPayments();
    } else {
      fetchReceivablePayments();
    }
  };
  useLayoutEffect(()=>{
     navigation.setOptions({
    headerTitle: isReceived ? 'Received Payments' : 'Receivable Payments',
    headerTitleStyle: {fontSize: 15, fontFamily: font.secondary},
    headerRight: () => (
      <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    )
  });
  },[navigation])
 

  const handleView = (payment) => {
    console.log('View:', payment);
    // You can navigate to a detail screen here if needed
    navigation.navigate('FeeView' , {id: payment.id});
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
    
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#75AB38" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={refreshData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={payments}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <PaymentCard
              payment={item}
              onView={handleView}
              onDelete={handleDelete}
              isReceived={isReceived}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {isReceived ? 'No received payments found' : 'No receivable payments found'}
              </Text>
            </View>
          }
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
