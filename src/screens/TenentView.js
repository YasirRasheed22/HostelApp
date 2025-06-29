import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';

export default function TenantView() {
  const route = useRoute();
  const { id } = route.params;

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
      }
    };

    fetchUser();
  }, [id]);

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

  const renderOverview = () => (
    <>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.card}>
        <Row label="Full Name" value={user?.name} />
        <Row label="CNIC/B-FORM" value={user?.cnic} />
        <Row label="Email Address" value={user?.email} />
        <Row label="Phone" value={user?.phone} />
        <Row label="Date of Birth" value={user?.dob} />
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
        <Row label="Security Fee" value={user?.securityFees} />
      </View>
    </>
  );

  const renderGuardianInfo = () => (
    <>
      <Text style={styles.sectionTitle}>Guardian Information</Text>
      <View style={styles.card}>
        {user?.guardian?.length > 0 ? (
          user.guardian.map((g, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Row label="Name" value={g.name} />
              <Row label="Phone" value={g.phone} />
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

  const Row = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  );

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
});
