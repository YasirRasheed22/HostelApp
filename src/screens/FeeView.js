import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const FeeInvoiceScreen = () => {
  const route = useRoute();
  const { id } = route.params;
      const [loading, setLoading] = useState(true);

  const [fee, setFee] = useState(null);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        if (!db) {
          console.log('DB not found');
          return;
        }

        const payload = { db_name: db };
        const response = await axios.put(`${ApiUrl}/api/fees/single/${id}`, payload);
        console.log('API Response:', response.data);
        setFee(response.data.data);
      } catch (error) {
        console.log('Error:', error.message);
      }finally{
        setLoading(false)

      }
    };

    fetchFee();
  }, [id]);

  if (!fee) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  const tenant = fee.tenants || {};

  const fees = [
    { title: 'Monthly Fees', amount: fee.amount },
    ...(fee.perk_name ? [{ title: fee.perk_name, amount: parseFloat(fee.perk_amount) }] : []),
    ...(fee.unfixed_perk_name ? [{ title: fee.unfixed_perk_name, amount: parseFloat(fee.unfixed_perk_amount) }] : []),
  ];

  const total = fees.reduce((acc, item) => acc + item.amount, 0);
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Fee Invoice</Text>

      <View style={styles.infoBox}>
        <Text style={styles.text}><Text style={styles.bold}>Name:</Text> {tenant.name}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Room:</Text> {tenant.room?.name || 'N/A'}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Address:</Text> {tenant.permanent_address}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Month For:</Text> {fee.month} / {fee.year}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Created Date:</Text> {new Date(fee.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Rate</Text>
        </View>
        {fees.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{item.title}</Text>
            <Text style={styles.cell}>Rs {item.amount.toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.bold]}>Balance</Text>
          <Text style={styles.cell}>Rs {total.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.bold]}>Net</Text>
          <Text style={styles.cell}>Rs {total.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Received ____________________</Text>
        <Text>Sign ____________________</Text>
        <Text>Stamp ____________________</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Perks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.printButton}>
          <Text style={styles.buttonText}>Print Fee</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FeeInvoiceScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
  },
     loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  footer: {
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  printButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
