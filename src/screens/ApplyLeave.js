import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AlertModal from '../components/CustomAlert';

export default function ApplyLeave() {
    const [showStartPicker, SetShowStartPicker] = useState(false);
    const [LeaveFor, setLeaveFor] = useState('staff');
    const [users, setUsers] = useState([]);
    const [date, setdate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
    const [description, setDescription] = useState();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [tenantId, setTenantId] = useState();
    const [staffId, setStaffId] = useState();

    useEffect(() => {
        const fetchTenants = async () => {
            const db = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name: db,
            };
            try {
                const response = await axios.put(`${ApiUrl}/api/tenants`, payload);
                setUsers(response.data?.data || []);
                console.log(response.data);
            } catch (error) {
                console.log(error.message);
            }finally{
                setLoading(false);
            }
        };
        const fetchStaff = async () => {
            const db = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name: db,
            };
            try {
                const response = await axios.put(`${ApiUrl}/api/users`, payload);
                setUsers(response.data?.data || []);
                console.log(response.data);
            } catch (error) {
                console.log(error.message);
            }finally{
                setLoading(false);
            }
        };

        if (LeaveFor === 'tenant') {
            fetchTenants()
        }
        if (LeaveFor === 'staff') {
            fetchStaff()
        }


    }, [LeaveFor]);


    const handleSubmit = async() => {
        setLoading(true);
        const db = await AsyncStorage.getItem('db_name');
        const payload = {
            reason: description,
            db_name: db,
            tenantId : tenantId,
            userId : staffId,
            leave_date: date
        }
        console.log(payload);
        try {
            console.log('running')
            const response = await axios.post(`${ApiUrl}/api/leave/create`, payload);
            console.log(response);
            setModalType('success');
        setModalMessage('Leave Applied Successfully');
        setModalVisible(true);
        } catch (error) {
            console.log(error.message)
              setModalType('danger');
        setModalMessage('Validation Error');
        setModalVisible(true);
        }finally{
            setLoading(false);
        }
    }
      if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

    return (
        <Provider>
            <View style={styles.container}>
                 <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
                <Text style={styles.label}>Select Leave For</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.toggle, LeaveFor === 'tenant' && styles.activeToggle]}
                        onPress={() => {
                            setLeaveFor('tenant');
                            setSelectedUser(null);
                        }}
                    >
                        <Text style={[styles.toggleText, LeaveFor === 'tenant' && styles.activeToggleText]}>Tenant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggle, LeaveFor === 'staff' && styles.activeToggle]}
                        onPress={() => {
                            setLeaveFor('staff');
                            setSelectedUser(null);
                        }}
                    >
                        <Text style={[styles.toggleText, LeaveFor === 'staff' && styles.activeToggleText]}>Staff</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Select Start Date</Text>
                <TextInput
                    label="Start Date"
                    value={date ? date.toDateString() : ''}
                    onFocus={() => SetShowStartPicker(true)}
                    style={styles.input}
                    underlineColor="transparent"
                    showSoftInputOnFocus={false}
                />
                {showStartPicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            SetShowStartPicker(false);
                            if (selectedDate) setdate(selectedDate);
                        }}
                    />
                )}

                <Text style={styles.label}>Select {LeaveFor === 'tenant' ? 'Tenant' : 'Staff'}</Text>
                <TouchableOpacity
                    onPress={() => setShowUserDropdown(!showUserDropdown)}
                    style={[styles.input, { justifyContent: 'center', height: 50 }]}
                >
                    <Text style={{ paddingLeft: 10, color: selectedUser ? '#000' : '#aaa' }}>
                        {selectedUser ? selectedUser.name || selectedUser.fullName : `Select ${LeaveFor}`}
                    </Text>
                </TouchableOpacity>

                {showUserDropdown && users.length > 0 && (
                    <View style={styles.dropdown}>
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item._id || item.id?.toString()}
                            renderItem={({ item }) => (
                               <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedUser(item);
                                        if (LeaveFor === 'tenant') {
                                            setTenantId(item._id || item.id);
                                            setStaffId(null); // Optional: clear other
                                        } else {
                                            setStaffId(item._id || item.id);
                                            setTenantId(null); // Optional: clear other
                                        }
                                        setShowUserDropdown(false);
                                    }}
                                >
                                    <Text style={styles.dropdownText}>{item?.name || item?.fullName}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                <TextInput
                    placeholder="REASON"
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                />


                <View style={[styles.row, { justifyContent: 'flex-end', marginTop: 30 }]}>
                
                    <TouchableOpacity onPress={handleSubmit} style={[styles.actionBtn, styles.saveBtn]}>
                        <Text style={styles.saveText}>Save changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#F9F9F9',
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    toggle: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#4CAF50',
        marginRight: 10,
    },
    toggleText: {
        color: '#75AB38',
        fontWeight: '500',
    },
    activeToggle: {
        backgroundColor: '#75AB38',
    },
    activeToggleText: {
        color: '#fff',
    },
    input: {
        padding: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        maxHeight: 300,
        borderRadius: 6,
        marginTop: 6,
        paddingVertical: 6,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    actionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 4,
        marginLeft: 10,
    },
    closeBtn: {
        backgroundColor: '#d4e157',
    },
    closeText: {
        color: '#000',
        fontWeight: '500',
    },
    saveBtn: {
        backgroundColor: '#75AB38',
    },
    saveText: {
        color: '#fff',
        fontWeight: '500',
    },
      loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
});
