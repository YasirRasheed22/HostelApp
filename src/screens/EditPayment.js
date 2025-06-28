import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { font } from '../components/ThemeStyle';
import { Modal, Portal, TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditPayment() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({
    iban: '',
    paymentMode: '',
    bankname: '',
    accNum: '',
    accTitle: '',
  });

  const [paymentModeModalVisible, setPaymentModeModalVisible] = useState(false);
  const paymentModeOptions = ['Cash', 'Bank', 'Easypaisa', 'Jazzcash'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const dbName = await AsyncStorage.getItem('db_name');
        setDb(dbName);

        const response = await axios.put(`${ApiUrl}/api/payment/${id}`, { db_name: dbName });
        console.log(response);
        const data = response.data?.payments;

        setValues({
          iban: data?.iban_number || '',
          paymentMode: data?.type || '',
          bankname: data?.bank_name || '',
          accNum: data?.account_number || '',
          accTitle: data?.account_title || '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment details:', err.message);
        Alert.alert('Error', 'Failed to load payment details');
      }
    };

    loadData();
  }, [id]);

  const handleUpdate = async () => {
    const payload = {
      bank_name: values.bankname,
      type: values.paymentMode,
      account_title: values.accTitle,
      account_number: values.accNum,
      iban_number: values.iban,
      db_name: db,
    };

    try {
     const response = await axios.post(`${ApiUrl}/api/payment/${id}`, payload);
      console.log(response)
      Alert.alert('Success', 'Payment updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Update error:', error.message);
      Alert.alert('Error', 'Failed to update payment');
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Edit Payment</Text>

      <TouchableOpacity
        onPress={() => setPaymentModeModalVisible(true)}
        style={styles.field}>
        <Text style={styles.fieldText}>
          {values.paymentMode || 'SELECT TYPE'}
        </Text>
      </TouchableOpacity>

      {values.paymentMode === 'Bank' && (
        <TextInput
          placeholder="BANK NAME"
          value={values.bankname}
          onChangeText={text => setValues({ ...values, bankname: text })}
          underlineColor="transparent"
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="ACCOUNT TITLE"
        value={values.accTitle}
        onChangeText={text => setValues({ ...values, accTitle: text })}
        underlineColor="transparent"
        style={styles.input}
      />

      <TextInput
        placeholder="ACCOUNT NUMBER"
        value={values.accNum}
        onChangeText={text => setValues({ ...values, accNum: text })}
        underlineColor="transparent"
        style={styles.input}
      />

      <TextInput
        placeholder="IBAN"
        value={values.iban}
        onChangeText={text => setValues({ ...values, iban: text })}
        underlineColor="transparent"
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Update</Text>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={paymentModeModalVisible}
          onDismiss={() => setPaymentModeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Payment Mode</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {paymentModeOptions.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setValues(prev => ({ ...prev, paymentMode: item }));
                  setPaymentModeModalVisible(false);
                }}
                style={styles.modalItem}>
                <Text style={[
                  styles.modalItemText,
                  item === values.paymentMode && { fontWeight: 'bold', color: '#75AB38' }
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: font.secondary,
    color: '#75AB38',
    marginBottom: 10,
  },
  input: {
    padding: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  field: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
  },
  fieldText: {
    color: '#333',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#75AB38',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: font.secondary,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: font.secondary,
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: font.primary,
  },
});
