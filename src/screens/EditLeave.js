import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import { useRoute } from '@react-navigation/native';

const statusOptions = ['pending', 'approved', 'rejected'];

export default function EditLeave() {
  const [showStartPicker, SetShowStartPicker] = useState(false);
  const [LeaveFor, setLeaveFor] = useState('staff');
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [tenantId, setTenantId] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const route = useRoute();
  const { id } = route.params;

  const fetchTenants = async (db) => {
    try {
      const response = await axios.put(`${ApiUrl}/api/tenants`, { db_name: db });
      setUsers(response.data?.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchStaff = async (db) => {
    try {
      const response = await axios.put(`${ApiUrl}/api/users`, { db_name: db });
      setUsers(response.data?.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const response = await axios.put(`${ApiUrl}/api/leave/${id}`, { db_name: db });
      const leave = response.data?.leaves;
      if (!leave) return;

      setDate(new Date(leave.leave_date));
      setDescription(leave.reason);
      setStatus(leave.status || 'pending');

      if (leave.userId && leave.user) {
        setLeaveFor('staff');
        setStaffId(leave.userId);
        setSelectedUser({ id: leave.userId, fullName: leave.user.fullName });
        fetchStaff(db);
      } else if (leave.tenantId && leave.tenant) {
        setLeaveFor('tenant');
        setTenantId(leave.tenantId);
        setSelectedUser({ id: leave.tenantId, name: leave.tenant.name });
        fetchTenants(db);
      }
    };

    init();
  }, []);

  const handleSubmit = async () => {
    const db = await AsyncStorage.getItem('db_name');
    const payload = {
      reason: description,
      db_name: db,
      tenantId: tenantId,
      userId: staffId,
      leave_date: date.toISOString(),
      status: status,
    };

    try {
      const response = await axios.put(`${ApiUrl}/api/leave/single/${id}`, payload);
      console.log(response);
      Alert.alert('Leave updated');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.label}>Select Leave For</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.toggle, LeaveFor === 'tenant' && styles.activeToggle]}
            onPress={async () => {
              const db = await AsyncStorage.getItem('db_name');
              setLeaveFor('tenant');
              setSelectedUser(null);
              setTenantId(null);
              setStaffId(null);
              fetchTenants(db);
            }}
          >
            <Text style={[styles.toggleText, LeaveFor === 'tenant' && styles.activeToggleText]}>
              Tenant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggle, LeaveFor === 'staff' && styles.activeToggle]}
            onPress={async () => {
              const db = await AsyncStorage.getItem('db_name');
              setLeaveFor('staff');
              setSelectedUser(null);
              setTenantId(null);
              setStaffId(null);
              fetchStaff(db);
            }}
          >
            <Text style={[styles.toggleText, LeaveFor === 'staff' && styles.activeToggleText]}>
              Staff
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Start Date</Text>
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
              if (selectedDate) setDate(selectedDate);
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
              keyExtractor={(item) => item.id?.toString() || item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedUser(item);
                    if (LeaveFor === 'tenant') {
                      setTenantId(item.id || item._id);
                      setStaffId(null);
                    } else {
                      setStaffId(item.id || item._id);
                      setTenantId(null);
                    }
                    setShowUserDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.name || item.fullName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <Text style={styles.label}>Status</Text>
        <TouchableOpacity
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          style={[styles.input, { justifyContent: 'center', height: 50 }]}
        >
          <Text style={{ paddingLeft: 10, color: '#000' }}>{status}</Text>
        </TouchableOpacity>

        {showStatusDropdown && (
          <View style={styles.dropdown}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  setStatus(option);
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
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
  container: { padding: 24, backgroundColor: '#F9F9F9', flex: 1 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  toggle: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 10,
  },
  toggleText: { color: '#75AB38', fontWeight: '500' },
  activeToggle: { backgroundColor: '#75AB38' },
  activeToggleText: { color: '#fff' },
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
    marginBottom: 6,
    paddingVertical: 6,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 14 },
  dropdownText: { fontSize: 14, color: '#333' },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 4,
    marginLeft: 10,
  },
  saveBtn: { backgroundColor: '#75AB38' },
  saveText: { color: '#fff', fontWeight: '500' },
});
