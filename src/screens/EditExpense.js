import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {font} from '../components/ThemeStyle';
import {Modal, Portal, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AlertModal from '../components/CustomAlert';

export default function EditExpense() {
  const route = useRoute();
  const {id} = route.params;

  const [db, setDb] = useState('');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
  const [existingFile, setExistingFile] = useState(null);
  const isFocused = useIsFocused();

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
  const [userModalVisible, setUserModalVisible] = useState(false);

  const expenseTypeOptions = [
    'Rent', 'Ubility', 'Mentainance', 'Food & Groceries',
    'Staff Salaries', 'Cleaning Supplies', 'Internet & Communication',
    'Furniture & Fixtures', 'Security Services', 'Laundry Services',
    'Transport', 'Repairs', 'Miscellaneous', 'Marketing & Advertising',
    'Insurance', 'Licenses & Permits', 'Entertainment & Events', 'Medical & First Aid'
  ];
  const paymentModeOptions = ['Cash', 'Bank', 'Easypaisa', 'Jazzcash'];

  const handleUpload = () => {
    Alert.alert('Upload File', 'Choose a method', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await launchCamera({mediaType: 'photo'});
          if (!result.didCancel && result.assets?.[0]) {
            setFile(result.assets[0]);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({mediaType: 'photo'});
          if (!result.didCancel && result.assets?.[0]) {
            setFile(result.assets[0]);
          }
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const db_name = await AsyncStorage.getItem('db_name');
      setDb(db_name);
      const payload = { db_name };

      try {
        const res = await axios.put(`${ApiUrl}/api/expenses/${id}`, payload);
        const exp = res.data?.data;

        setValues({
          title: exp.title || '',
          expensePrice: exp.price?.toString() || '',
          expenseType: exp.expense_type || '',
          expenseDate: exp.date_for || '',
          paymentMode: exp.payment_type || '',
          user: exp.expense_made_by || '',
          desc: exp.description || '',
        });

        if (exp.attachments?.[0]?.file_url) {
          setExistingFile(exp.attachments[0].file_url);
        }

        const staffRes = await axios.put(`${ApiUrl}/api/users`, { db_name });
        setStaff(staffRes.data?.data || []);
      } catch (err) {
        console.log('Load error:', err.message);
      }finally{
        setLoading(false);
      }
    };

    if (isFocused) {
      loadInitialData();
    }
  }, [id, isFocused]);

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('price', values.expensePrice);
    formData.append('date_for', values.expenseDate);
    formData.append('payment_type', values.paymentMode);
    formData.append('description', values.desc);
    formData.append('expense_type', values.expenseType);
    formData.append('expense_made_by', values.user);
    formData.append('if_other_expense_type', '');
    formData.append('db_name', db);
if (file) {
  formData.append('attachments[]', {
    uri: file.uri,
    type: file.type,
    name: file.fileName || `upload-${Date.now()}.jpg`,
  });
}


    console.log(formData)
    try {
      const response = await axios.post(`${ApiUrl}/api/expenses/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

       setModalType('success');
        setModalMessage('Expense Updated Successfully');
        setModalVisible(true);
      console.log(response);
    } catch (error) {
      console.error('Update error:', error.message);
        setModalType('danger');
        setModalMessage('Validation Error');
        setModalVisible(true);
    }finally{
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Edit Expense</Text>
       <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>

      <TextInput
        placeholder="TITLE"
        value={values.title}
        onChangeText={text => setValues({...values, title: text})}
        style={styles.input}
      />

      <TextInput
        placeholder="EXPENSE PRICE"
        value={values.expensePrice}
        onChangeText={text => setValues({...values, expensePrice: text})}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={() => setExpenseTypeModalVisible(true)} style={styles.field}>
        <Text style={styles.fieldText}>{values.expenseType || 'SELECT EXPENSE TYPE'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.field}>
        <Text style={styles.fieldText}>{values.expenseDate || 'CHOOSE DATE'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type === 'set' && selectedDate) {
              const formattedDate = selectedDate.toISOString().split('T')[0];
              setValues(prev => ({...prev, expenseDate: formattedDate}));
            }
          }}
        />
      )}

      <TouchableOpacity onPress={() => setPaymentModeModalVisible(true)} style={styles.field}>
        <Text style={styles.fieldText}>{values.paymentMode || 'SELECT PAYMENT MODE'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setUserModalVisible(true)} style={styles.field}>
        <Text style={styles.fieldText}>{values.user || 'SELECT USER'}</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="DESCRIPTION"
        multiline
        numberOfLines={4}
        value={values.desc}
        onChangeText={text => setValues({...values, desc: text})}
        style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
      />

      <View style={{padding: 16}}>
        <Text style={{marginBottom: 12}}>Upload a new supporting file or image:</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.saveBtnText}>Upload File</Text>
        </TouchableOpacity>
        {file && (
          <Text style={{marginTop: 10, color: 'green'}}>Selected: {file.fileName}</Text>
        )}
        {existingFile && !file && (
          <Image
            source={{uri: existingFile}}
            style={{width: 100, height: 100, marginTop: 10}}
            resizeMode="contain"
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Update</Text>
      </TouchableOpacity>

      {/* Modals (same for all fields) */}
      <Portal>
        <Modal visible={expenseTypeModalVisible} onDismiss={() => setExpenseTypeModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Expense Type</Text>
          <ScrollView style={{maxHeight: 300}}>
            {expenseTypeOptions.map(item => (
              <TouchableOpacity key={item} onPress={() => {
                setValues(prev => ({...prev, expenseType: item}));
                setExpenseTypeModalVisible(false);
              }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={paymentModeModalVisible} onDismiss={() => setPaymentModeModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Payment Mode</Text>
          <ScrollView style={{maxHeight: 300}}>
            {paymentModeOptions.map(item => (
              <TouchableOpacity key={item} onPress={() => {
                setValues(prev => ({...prev, paymentMode: item}));
                setPaymentModeModalVisible(false);
              }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={userModalVisible} onDismiss={() => setUserModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select User</Text>
          <ScrollView style={{maxHeight: 300}}>
            {staff?.map(item => (
              <TouchableOpacity key={item.id} onPress={() => {
                setValues(prev => ({...prev, user: item.id}));
                setUserModalVisible(false);
              }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>{item.fullName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  sectionTitle: { fontSize: 18, fontFamily: font.secondary, color: '#75AB38', marginBottom: 10 },
  input: { padding: 0, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fff', marginBottom: 10, paddingHorizontal: 10 },
  field: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 14, marginBottom: 16, backgroundColor: '#fff', height: 60, justifyContent: 'center' },
  fieldText: { color: '#333', fontSize: 16 },
  saveBtn: { backgroundColor: '#75AB38', paddingVertical: 14, borderRadius: 6, alignItems: 'center', marginTop: 20 },
  uploadBtn: { backgroundColor: '#75AB38', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontFamily: font.secondary },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontFamily: font.secondary, marginBottom: 10 },
  modalItem: { paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
  modalItemText: { fontSize: 16, fontFamily: font.primary },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
});
