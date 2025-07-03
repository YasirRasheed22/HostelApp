import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { ApiUrl } from '../../config/services';
import AlertModal from '../components/CustomAlert';

export default function EditFee() {
    const route = useRoute();
    const [staffMembers, setStaffMembers] = useState([]); // 🛠️ Add this

    const navigation = useNavigation();
    const { id } = route.params;
    const [loading, setLoading] = useState(true);

    const [feeData, setFeeData] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    const [accountOption, setAccountOption] = useState([]);
    const [accOptions, setAccOptions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dropdown, setDropdown] = useState({ key: null });

    const [form, setForm] = useState({
        status: '',
        user: '',
        paymentDate: new Date(),
        paymentMode: '',
        account: '',
        transactionId: '',
        receivedStatus: '',
    });

    const statusOptions = [
        { label: 'Paid', value: 'paid' },
        { label: 'Unpaid', value: 'unpaid' },
    ];

    const paymentModes = [
        { label: 'Cash', value: 'cash' },
        { label: 'Bank Transfer', value: 'bank' },
        { label: 'EasyPaisa', value: 'easypaisa' },
        { label: 'JazzCash', value: 'jazzcash' },
        { label: 'NayaPay', value: 'nayapay' },
    ];

    const receivedStatuses = [
        { label: 'Verified', value: 'verified' },
        { label: 'Unverified', value: 'un-verified' },
    ];

    const dropdownLists = {
        status: statusOptions,
        user: userOptions,
        paymentMode: paymentModes,
        account: accOptions,
        receivedStatus: receivedStatuses,
    };

    const filterAccounts = (mode, list = accountOption) => {
        if (!mode) return;
        const filtered = list.filter(i => i.type === mode);
        setAccOptions(filtered.map(user => ({
            label: `${user.bank_name || user.type} - ${user.account_number}`,
            value: user.bank_name || user.type,
        })));
    };

    useEffect(() => {
        const fetchFeeData = async () => {
            try {
                const db = await AsyncStorage.getItem('db_name');
                const response = await axios.put(`${ApiUrl}/api/fees/single/${id}`, {
                    db_name: db,
                });
                const data = response.data.data;
                setFeeData(data);

                const updatedForm = {
                    status: data.status || '',
                    user: data.receiver || '',
                    paymentDate: data.payment_date ? new Date(data.payment_date) : new Date(),
                    paymentMode: data.payment_mode || '',
                    account: data.payment_id || '',
                    transactionId: data.transaction_id || '',
                    receivedStatus: data.payment_received_status || '',
                };
                setForm(updatedForm);
            } catch (err) {
                console.log('Fee Fetch Error:', err.message);
            }finally{
                setLoading(false);
            }
        };

        const fetchStaff = async () => {
            try {
                const db = await AsyncStorage.getItem('db_name');
                const response = await axios.put(`${ApiUrl}/api/users`, { db_name: db });
                const users = response.data?.data || [];

                setStaffMembers(users); // ✅ Store raw users
                const options = users.map(user => ({
                    label: user.fullName,
                    value: user.fullName,
                }));
                setUserOptions(options);
            } catch (error) {
                console.log('Staff Fetch Error:', error.message);
            }finally{
                setLoading(false);
            }
        };


        const fetchAccounts = async () => {
            try {
                const db = await AsyncStorage.getItem('db_name');
                const response = await axios.put(`${ApiUrl}/api/payment`, { db_name: db });
                const users = response.data?.payments || [];
                setAccountOption(users);
                filterAccounts(form.paymentMode, users);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchFeeData();
        fetchStaff();
        fetchAccounts();
    }, [id]);

    const onSave = async () => {
        try {
            setLoading(true);
            const db = await AsyncStorage.getItem('db_name');

            const selectedUserObj = staffMembers.find(
                user => user.fullName === form.user
            );

            const selectedAccountObj = accountOption.find(
                acc => acc.bank_name === form.account || acc.type === form.account
            );

            const payload = {
                db_name: db,
                payment_date: form.paymentDate.toISOString(),
                payment_id: selectedAccountObj?.id,
                payment_mode: form.paymentMode.charAt(0).toUpperCase() + form.paymentMode.slice(1),
                selectedUser: selectedUserObj?.id,
                status: form.status,
                transaction_id: form.transactionId,
            };

            if (!payload.payment_id || !payload.selectedUser) {
                setModalType('danger');
        setModalMessage('Select a valid User');
        setModalVisible(true);
                return;
            }

            console.log('Payload:', payload); // ✅ Debug here

            const response = await axios.post(`${ApiUrl}/api/fees/single/${id}`, payload);
            console.log(response)
            
           setModalType('success');
        setModalMessage('Fee Updated Successfully');
        setModalVisible(true);
            navigation.goBack();
        } catch (err) {
            console.log('Save Error:', err.message);
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
    const renderDropdown = (label, key) => (
        <View style={styles.dropdownContainer}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdown({ key })}
            >
                <Text>{dropdownLists[key]?.find(i => i.value === form[key])?.label || 'Select...'}</Text>
            </TouchableOpacity>
        </View>
    );

    if (!feeData) {
        return <Text style={{ padding: 20 }}>Loading fee details...</Text>;
    }

    const tenant = feeData.tenants || {};

    return (
        <ScrollView contentContainerStyle={styles.container}>
             <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
            <Text style={styles.heading}>Edit {tenant.name} Fee</Text>

            <View style={styles.infoBox}>
                <Text style={styles.label}>Full Name</Text>
                <Text>{tenant.name}</Text>

                <Text style={styles.label}>Phone Number</Text>
                <Text>{tenant.phone}</Text>

                <Text style={styles.label}>Month</Text>
                <Text>{feeData.month}/{feeData.year}</Text>

                <Text style={styles.label}>Amount</Text>
                <Text>Rs {feeData.amount?.toLocaleString()}</Text>

                <Text style={styles.label}>Last Date</Text>
                <Text>{feeData.last_payment_date?.toLocaleString()}</Text>
            </View>

            {renderDropdown('Status', 'status')}
            {renderDropdown('User', 'user')}

            <View style={styles.inputRow}>
                <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center' }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{form.paymentDate.toDateString()}</Text>
                </TouchableOpacity>
            </View>

            {renderDropdown('Payment Mode', 'paymentMode')}
            {renderDropdown('Account', 'account')}

            <TextInput
                placeholder="TRANSACTION ID"
                value={form.transactionId}
                onChangeText={val => setForm({ ...form, transactionId: val })}
                style={styles.input}
            />

            {renderDropdown('Received Payment Status', 'receivedStatus')}

            {showDatePicker && (
                <DateTimePicker
                    value={form.paymentDate}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setForm({ ...form, paymentDate: selectedDate });
                    }}
                />
            )}

            <View style={styles.buttonRow}>
  <TouchableOpacity style={[styles.button, styles.outlinedButton]} onPress={() => navigation.goBack()}>
    <Text style={styles.outlinedText}>Close</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.button, styles.containedButton]} onPress={onSave}>
    <Text style={styles.containedText}>Save</Text>
  </TouchableOpacity>
</View>


            <Modal visible={!!dropdown.key} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPressOut={() => setDropdown({ key: null })}
                    activeOpacity={1}
                >
                    <View style={styles.modal}>
                        <FlatList
                            data={dropdownLists[dropdown.key] || []}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setForm(prev => ({ ...prev, [dropdown.key]: item.value }));
                                        if (dropdown.key === 'paymentMode') {
                                            filterAccounts(item.value);
                                        }
                                        setDropdown({ key: null });
                                    }}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoBox: {
        marginBottom: 20,
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 6,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    dropdownContainer: {
        marginBottom: 10,
    },
    dropdown: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 30,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 10,
        maxHeight: 300,
    },
    modalItem: {
        padding: 10,
    },
    button: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 6,
  alignItems: 'center',
},

outlinedButton: {
  borderWidth: 1,
  borderColor: '#000',
  marginRight: 5,
},

containedButton: {
  backgroundColor: '#6A9A35',
  marginLeft: 5,
},

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },

outlinedText: {
  color: '#000',
  fontWeight: 'bold',
},

containedText: {
  color: '#fff',
  fontWeight: 'bold',
},

});
