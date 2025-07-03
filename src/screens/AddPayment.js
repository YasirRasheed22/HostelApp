import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { font } from '../components/ThemeStyle';
import {  Modal, Portal, TextInput } from 'react-native-paper';

import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../components/CustomAlert';



export default function AddPayment() {
    const [db, setDb] = useState();

    const [values, setValues] = useState({
        iban: '',
        paymentMode: 'Bank',
        bankname: '',
        accNum: '',
        accTitle:'',
    });
    const [loading, setLoading] = useState(false);
      const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); // or 'success'

    const [paymentModeModalVisible, setPaymentModeModalVisible] = useState(false);

    const paymentModeOptions = ['Cash', 'Bank', 'Easypaisa', 'Jazzcash'];

    const validateForm = () => {
  if (!values.paymentMode) {
    setModalType('danger');
    setModalMessage('Please select a payment mode');
    setModalVisible(true);
    return false;
  }

  if (values.paymentMode === 'Bank' && !values.bankname.trim()) {
    setModalType('danger');
    setModalMessage('Bank name is required');
    setModalVisible(true);
    return false;
  }

  if (!values.accTitle.trim()) {
    setModalType('danger');
    setModalMessage('Account title is required');
    setModalVisible(true);
    return false;
  }

  if (!values.accNum.trim()) {
    setModalType('danger');
    setModalMessage('Account number is required');
    setModalVisible(true);
    return false;
  }

  if (!values.iban.trim()) {
    setModalType('danger');
    setModalMessage('IBAN is required');
    setModalVisible(true);
    return false;
  }

  return true;
};

const handleSave = async () => {
  if (!validateForm()) return;

  const db = await AsyncStorage.getItem('db_name');
  setLoading(true);

  const payload = {
    bank_name: values.bankname,
    type: values.paymentMode,
    account_title: values.accTitle,
    account_number: values.accNum,
    iban_number: values.iban,
    db_name: db
  };

  try {
    const response = await axios.post(`${ApiUrl}/api/payment`, payload);
    setModalType('success');
    setModalMessage('Account Added Successfully');
    setModalVisible(true);
  } catch (error) {
    console.log(error);
    setModalType('danger');
    setModalMessage('Validation Error');
    setModalVisible(true);
  } finally {
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
            <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
            <Text style={styles.sectionTitle}>Expense Information</Text>

            <View style={styles.row}>

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
                     keyboardType='numeric'
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
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
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
      loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
