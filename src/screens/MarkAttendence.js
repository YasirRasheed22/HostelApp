import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AlertModal from '../components/CustomAlert';

export default function MarkAttendance() {
  const [tenants, setTenants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [attendanceType, setAttendanceType] = useState('In');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [date, setDate] = useState(null);
  const [loading , setLoading] = useState(true)

  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  // Fetch tenants from backend
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const payload = { db_name: db };
        const response = await axios.put(`${ApiUrl}/api/tenants/`, payload);
        const data = response.data?.data || [];
        setTenants(data);
      } catch (error) {
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  // Available tenants = not yet selected
  const availableTenants = tenants.filter(
    (t) => !selectedTenants.some((st) => st.id === t.id)
  );

  // Add tenant to selection
  const handleSelectTenant = (tenant) => {
    setSelectedTenants((prev) => [...prev, tenant]);
    setShowTenantDropdown(false);
  };

  // Remove tenant
  const handleRemoveTenant = (tenantId) => {
    setSelectedTenants((prev) => prev.filter((t) => t.id !== tenantId));
  };

  // Picker
  const showPicker = (mode) => {
    setPickerMode(mode);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedValue) => {
    if (!selectedValue) {
      setShowDatePicker(false);
      return;
    }

    if (pickerMode === 'date') {
      const pickedDate = new Date(selectedValue);
      setTempDate((prev) =>
        new Date(pickedDate.setHours(prev.getHours(), prev.getMinutes()))
      );
      setShowDatePicker(false);
      setTimeout(() => {
        showPicker('time');
      }, 200);
    } else {
      const pickedTime = new Date(selectedValue);
      const combined = new Date(tempDate);
      combined.setHours(pickedTime.getHours());
      combined.setMinutes(pickedTime.getMinutes());
      setDate(combined);
      setShowDatePicker(false);
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '';
    return dt.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSave = async () => {

    if (selectedTenants.length === 0 || !date) {
      Alert.alert('Missing Info', 'Please select tenants and date/time.');
      return;
    }
    setLoading(true)

    const db = await AsyncStorage.getItem('db_name');
    const payload = {
      db_name: db,
      dateTime: formatDateTime(date),
      status: attendanceType,
      tenant_ids: selectedTenants.map(t => t.id).join(','),
    };
    console.log(payload)

    try {
      const response = await axios.post(
        `${ApiUrl}/api/attendance/mark-attendance`,
        payload
      );
      console.log(response);
      setModalType('success');
        setModalMessage('Attendance marked successfully');
        setModalVisible(true);
    } catch (error) {
      console.log(error.message);
        setModalType('danger');
        setModalMessage('Validation Error');
        setModalVisible(true);
    }finally{
      setLoading(false)
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
    <View style={styles.container}>
       <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
      <Text style={styles.heading}>Mark Attendance</Text>

      {/* In/Out Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            attendanceType === 'In' && styles.activeButton,
          ]}
          onPress={() => setAttendanceType('In')}
        >
          <Text
            style={[
              styles.toggleText,
              attendanceType === 'In' && styles.activeText,
            ]}
          >
            In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            attendanceType === 'Out' && styles.activeButton,
          ]}
          onPress={() => setAttendanceType('Out')}
        >
          <Text
            style={[
              styles.toggleText,
              attendanceType === 'Out' && styles.activeText,
            ]}
          >
            Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selected Tenants */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {selectedTenants.map((tenant) => (
          <View key={tenant.id} style={styles.chip}>
            <Text style={styles.chipText}>{tenant.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveTenant(tenant.id)}>
              <Text style={styles.removeText}> ✕ </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tenant Dropdown Trigger */}
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setShowTenantDropdown(!showTenantDropdown)}
      >
        <Text style={styles.dropdownText}>+ Add Tenant</Text>
      </TouchableOpacity>

      {/* Tenant Dropdown List */}
      {showTenantDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={availableTenants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectTenant(item)}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Date + Time Picker */}
      <TouchableOpacity onPress={() => showPicker('date')} style={styles.datePicker}>
        <Text style={styles.dateText}>
          {date ? formatDateTime(date) : 'SELECT DATE & TIME'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode={pickerMode}
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const green = '#75AB38';
const gray = '#ccc';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    color: green,
    fontSize: 18,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: green,
  },
  toggleText: {
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  dropdownTrigger: {
    padding: 15,
    borderColor: gray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdown: {
    borderColor: gray,
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 120,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownText: {
    color: '#666',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#333',
  },
  removeText: {
    color: '#900',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  datePicker: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    color: '#333',
  },
  saveButton: {
    backgroundColor: green,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
