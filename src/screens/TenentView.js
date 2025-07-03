import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';

export default function TenantView() {
  const route = useRoute();
  const { id } = route.params;
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

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


  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const isFocussed = useIsFocused()
  useEffect(() => {
    const fetchUser = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
      };
      try {
        const response = await axios.post(`${ApiUrl}/api/tenants/single/${id}`, payload);
        setUser(response.data.tenant);
      } catch (error) {
        console.log('Error fetching user:', error.message);
      } finally {
        setLoading(false)
      }
    };

    fetchUser();
  }, [id, isFocussed]);

  function formatToPakistaniCurrency(amount) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  const handleEdit = () => {
    console.log('User ID from edit view:', id);
    navigation.navigate('EditTenant', { id: id });
  };

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
              await axios.delete(`${ApiUrl}/api/tenants/${id}`, {
                data: { db_name: db },
              });
              console.log('Tenant deleted successfully');
              // fetchTenants();
              navigation.goBack();
              // Optional: refresh list or show success toast
            } catch (error) {
              console.error('Error deleting room:', error.message);
              Alert.alert('Error', 'Failed to delete the room.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };


  const renderTabButton = (label, key) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === key && styles.activeTab]}
      onPress={() => setActiveTab(key)}
    >
      <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

  const renderOverview = () => (
    <>
    <View style={{paddingBottom:30}}>

      <Text style={styles.sectionTitle}>Personal Information</Text>

      <View style={styles.imageContainer}>
        <Image source={{ uri: user?.profile_image }} style={styles.roundImage} />
      </View>
      <View style={styles.card}>
        <Row label="Full Name" value={user?.name} />
        <Row label="CNIC/B-FORM" value={user?.cnic} />
        <Row label="Email Address" value={user?.email} />
        <Row
          onPress={() => Linking.openURL(`tel:${user?.phone}`)}
          label="Phone"
          value={user?.phone}
        />
        <Row label="Date of Birth" value={formatDate(user?.dob)} />
        <Row label="Gender" value={user?.gender} />
        <Row label="Filing Status" value={user?.marital_status} />
        <Row label="Address" value={user?.permanent_address} />
        <Row label="State" value={user?.state} />
      </View>

      <Text style={styles.sectionTitle}>Job Information</Text>
      <View style={styles.card}>
        <Row label="Job Title" value={user?.job_title} />
        <Row label="Job Location" value={user?.job_location} />
      </View>

      <Text style={styles.sectionTitle}>Room Information</Text>
      <View style={styles.card}>
        <Row label="Room Name" value={user?.room?.name} />
        <Row label="Room Fee" value={user?.rentForRoom} />
        <Row label="Security Fee" value={formatToPakistaniCurrency(user?.securityFees)} />
      </View>
      {JSON.parse(user.property_info).length !== 0 ? (
        <>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.card}>
            {user?.property_info ? (
              JSON.parse(user.property_info).map((property, index) => (
                <Row key={index} label={`Property ${index + 1}`} value={property} />
              ))
            ) : (
              <Text style={{ color: 'gray' }}>No property information available.</Text>
            )}
          </View></>
        
      )  :null 
      }
 </View>
    </>
  );

  const renderGuardianInfo = () => (
    <>
      <Text style={styles.sectionTitle}>Guardian Information</Text>
      <View style={{}}>
        {user?.guardian?.length > 0 ? (
          user.guardian.map((g, index) => (
            <View key={index} style={[ styles.card ,{marginBottom: 10} ]}>
              <Row label="Name" value={g.name} />
              <Row onPress={() => Linking.openURL(`tel:${user?.phone}`)} label="Phone" value={g.phone} />
              <Row label="Relation" value={g.relation} />
              <Row label="Email" value={g.email} />
              <Row label="CNIC" value={g.cnic} />
            </View>
          ))
        ) : (
          <Text style={{ color: 'gray' }}>No guardian info available.</Text>
        )}
      </View>
    </>
  );

  const renderFeeTimeline = () => (
    <>
    
      <Text style={styles.sectionTitle}>Fees Timeline</Text>
      <View style={styles.card}>
        {user?.tenants?.length > 0 ? (
          user.tenants.map((fee, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Row label="Month" value={`${fee.month}-${fee.year}`} />
              <Row label="Amount" value={fee.amount} />
              <Row label="Perk" value={`${fee.perk_name}: ${fee.perk_amount}`} />
              <Row label="Unfixed Perk" value={`${fee.unfixed_perk_name}: ${fee.unfixed_perk_amount}`} />
              <Row label="Payment Status" value={fee.status} />
              <Row label="Payment Received" value={fee.payment_received_status} />
              <Row label="Last Payment Date" value={fee.last_payment_date} />
            </View>
          ))
        ) : (
          <Text style={{ color: 'gray' }}>No fee timeline available.</Text>
        )}
      </View>
    </>
  );

  const Row = ({ label, value, onPress }) => {
    const Wrapper = onPress ? TouchableOpacity : View;

    return (
      <Wrapper onPress={onPress} style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[
            styles.value,
            onPress && { color: 'blue', textDecorationLine: 'none' },
          ]}
        >
          {value ?? 'N/A'}
        </Text>
      </Wrapper>
    );
  };


  if (!user) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('Overview Info', 'overview')}
        {renderTabButton('Guardian Info', 'guardian')}
        {renderTabButton('Fees Timeline', 'fees')}
      </View>

      {/* Conditional Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'guardian' && renderGuardianInfo()}
      {activeTab === 'fees' && renderFeeTimeline()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    paddingBottom:40,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 10,
  },
  buttonContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    width: '48%',
  },
  value: {
    color: '#444',
    width: '48%',
    textAlign: 'right',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'green',
  },
  tabText: {
    color: 'black',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roundImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#75AB38',
  },
});
