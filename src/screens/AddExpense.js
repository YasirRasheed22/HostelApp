import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {font} from '../components/ThemeStyle';
import {Button, Modal, Portal, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import {useIsFocused} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function AddExpense() {
  const [staff, setStaffMembers] = useState();
  const [db, setDb] = useState();
  const isFocused = useIsFocused();
  const [fileName, setFileName] = useState(null);

  const handleUpload = () => {
    Alert.alert(
      'Upload File',
      'Choose a method',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await launchCamera({mediaType: 'photo'});
            if (!result.didCancel) {
              setFileName(result.assets[0]);
              console.log(result.assets[0]);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await launchImageLibrary({mediaType: 'mixed'});
            if (!result.didCancel) {
              setFileName(result.assets[0].fileName);
              console.log(result.assets[0]);
            }
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    const fetchStaff = async () => {
      const db = await AsyncStorage.getItem('db_name');
      setDb(db);
      const payload = {
        db_name: db,
      };
      console.log(payload);
      try {
        const response = await axios.put(`${ApiUrl}/api/users`, payload);
        console.log(response.data.users);
        setStaffMembers(response.data.users);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchStaff();
  }, [isFocused]);

  const [values, setValues] = useState({
    title: '',
    expensePrice: '',
    expenseType: '',
    expenseDate: '',
    paymentMode: '',
    user: '',
    desc: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenseTypeModalVisible, setExpenseTypeModalVisible] = useState(false);
  const [paymentModeModalVisible, setPaymentModeModalVisible] = useState(false);
  const [userModalVisible, setusersModalVisible] = useState(false);

  const expenseTypeOptions = [
    'Rent',
    'Ubility',
    'Mentainance',
    'Food & Groceries',
    'Staff Salaries',
    'Cleaning Supplies',
    'Internet & Communication',
    'Furniture & Fixtures',
    'Security Services',
    'Laundry Services',
    'Transport',
    'Repairs',
    'Miscellaneous',
    'Marketing & Advertising',
    'Insurance',
    'Licenses & Permits',
    'Entertainment & Events',
    'Medical & First Aid',
  ];

  const paymentModeOptions = ['Cash', 'Bank', 'Easypaisa', 'Jazzcash'];
  const users = staff;

  const handleSave = async () => {
    console.log('Values from state:', values);

    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('date_for', values.expenseDate);
    formData.append('description', values.desc);
    formData.append('payment_type', values.paymentMode);
    formData.append('expense_type', values.expenseType);
    formData.append('expense_made_by', values.user);
    formData.append('if_other_expense_type', '');
    formData.append('price', values.expensePrice);
    formData.append('db_name', db);

    console.log('FormData contents:', formData);

    try {
      const response = await axios.post(`${ApiUrl}/api/expenses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      Alert.alert('Expense Added Successfully');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Expense Information</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="TITLE"
          value={values.title}
          onChangeText={text => setValues({...values, title: text})}
          underlineColor="transparent"
          style={styles.input}
        />

        <TextInput
          placeholder="EXPENSE PRICE"
          value={values.expensePrice}
          onChangeText={text => setValues({...values, expensePrice: text})}
          underlineColor="transparent"
          style={styles.input}
          keyboardType="numeric"
        />

        {/* EXPENSE TYPE */}
        <TouchableOpacity
          onPress={() => setExpenseTypeModalVisible(true)}
          style={styles.field}>
          <Text style={styles.fieldText}>
            {values.expenseType || 'SELECT EXPENSE TYPE'}
          </Text>
        </TouchableOpacity>

        {/* DATE PICKER */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.field}>
          <Text style={styles.fieldText}>
            {values.expenseDate || 'CHOOSE DATE'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === 'set' && selectedDate) {
                const formattedDate = `${selectedDate
                  .getDate()
                  .toString()
                  .padStart(2, '0')}-${(selectedDate.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')}-${selectedDate.getFullYear()}`;

                setValues(prev => ({...prev, expenseDate: formattedDate}));
              }
            }}
          />
        )}

        {/* PAYMENT MODE */}
        <TouchableOpacity
          onPress={() => setPaymentModeModalVisible(true)}
          style={styles.field}>
          <Text style={styles.fieldText}>
            {values.paymentMode || 'SELECT PAYMENT MODE'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setusersModalVisible(true)}
          style={styles.field}>
          <Text style={styles.fieldText}>{values?.user || 'SELECT USER'}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="DESCRIPTION"
          multiline
          numberOfLines={4}
          value={values.desc}
          onChangeText={text => setValues({...values, desc: text})}
          underlineColor="transparent"
          style={[ styles.input, {height: 100, textAlignVertical: 'auto'}]}
        />
      </View>

      <View style={{padding: 16}}>
        <Text style={{marginBottom: 12}}>
          Please upload a supporting document or photo.
        </Text>

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
           <Text style={styles.saveBtnText}>Upload File</Text>
        </TouchableOpacity>

        {fileName && (
          <Text style={{marginTop: 10, color: 'green'}}>
            Selected: {fileName}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>

      {/* Expense Type Modal */}
      <Portal>
        <Modal
          visible={expenseTypeModalVisible}
          onDismiss={() => setExpenseTypeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Expense Type</Text>
          <ScrollView style={{maxHeight: 300}}>
            {expenseTypeOptions.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setValues(prev => ({...prev, expenseType: item}));
                  setExpenseTypeModalVisible(false);
                }}
                style={styles.modalItem}>
                <Text
                  style={[
                    styles.modalItemText,
                    item === values.expenseType && {
                      fontWeight: 'bold',
                      color: '#75AB38',
                    },
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Payment Mode Modal */}
      <Portal>
        <Modal
          visible={paymentModeModalVisible}
          onDismiss={() => setPaymentModeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Payment Mode</Text>
          <ScrollView style={{maxHeight: 300}}>
            {paymentModeOptions.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setValues(prev => ({...prev, paymentMode: item}));
                  setPaymentModeModalVisible(false);
                }}
                style={styles.modalItem}>
                <Text
                  style={[
                    styles.modalItemText,
                    item === values.paymentMode && {
                      fontWeight: 'bold',
                      color: '#75AB38',
                    },
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={userModalVisible}
          onDismiss={() => setusersModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select User</Text>
          <ScrollView style={{maxHeight: 300}}>
            {users?.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setValues(prev => ({...prev, user: item.id}));
                  setusersModalVisible(false);
                }}
                style={styles.modalItem}>
                <Text
                  style={[
                    styles.modalItemText,
                    item.fullName === values.paymentMode && {
                      fontWeight: 'bold',
                      color: '#75AB38',
                    },
                  ]}>
                  {item.fullName}
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
  row: {
    flexDirection: 'column',
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
  uploadBtn: {
    backgroundColor: '#75AB38',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    // marginTop: 20,
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
