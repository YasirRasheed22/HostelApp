import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { TextInput, Provider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { font } from '../components/ThemeStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import { useNavigation } from '@react-navigation/native';

export default function GenerateAttendence() {

    const navigation = useNavigation();
  const [tenants, setTenants] = useState([]);
  const [availableTenants, setAvailableTenants] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState([]);

  const [dateType, setDateType] = useState('single');
  const [reportType, setReportType] = useState('out');
  const [tenantType, setTenantType] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const payload = { db_name: db };
        const response = await axios.put(`${ApiUrl}/api/tenants/`, payload);
        const data = response.data?.data || [];
        setTenants(data);
        setAvailableTenants(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTenants();
  }, []);

  const onChangeStartDate = (event, date) => {
    setShowStartPicker(false);
    if (date) setStartDate(date);
  };

  const onChangeEndDate = (event, date) => {
    setShowEndPicker(false);
    if (date) setEndDate(date);
  };

  const handleSelectTenant = (tenant) => {
    setSelectedTenants([...selectedTenants, tenant]);
    setAvailableTenants(availableTenants.filter(t => t.id !== tenant.id));
    setShowTenantDropdown(false);
  };

  const handleRemoveTenant = (tenant) => {
    setSelectedTenants(selectedTenants.filter(t => t.id !== tenant.id));
    setAvailableTenants([...availableTenants, tenant].sort((a, b) => a.name.localeCompare(b.name)));
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.label}>Select Date Type</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.toggle, dateType === 'single' && styles.activeToggle]}
            onPress={() => setDateType('single')}
          >
            <Text style={[styles.toggleText, dateType === 'single' && styles.activeToggleText]}>Single Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggle, dateType === 'range' && styles.activeToggle]}
            onPress={() => setDateType('range')}
          >
            <Text style={[styles.toggleText, dateType === 'range' && styles.activeToggleText]}>Start Date / End Date</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          label="Start Date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onFocus={() => setShowStartPicker(true)}
          style={styles.input}
          underlineColor="transparent"
          showSoftInputOnFocus={false}
        />
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
          />
        )}

        {dateType === 'range' && (
          <>
            <TextInput
              label="End Date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onFocus={() => setShowEndPicker(true)}
              style={styles.input}
              underlineColor="transparent"
              showSoftInputOnFocus={false}
            />
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={onChangeEndDate}
              />
            )}
          </>
        )}

        <Text style={styles.label}>Select Report Type</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.toggle, reportType === 'in' && styles.activeToggle]}
            onPress={() => setReportType('in')}
          >
            <Text style={[styles.toggleText, reportType === 'in' && styles.activeToggleText]}>In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggle, reportType === 'out' && styles.activeToggle]}
            onPress={() => setReportType('out')}
          >
            <Text style={[styles.toggleText, reportType === 'out' && styles.activeToggleText]}>Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Tenant</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.toggle, tenantType === 'all' && styles.activeToggle]}
            onPress={() => {setTenantType('all'); setShowTenantDropdown(!showTenantDropdown);} }
          >
            <Text style={[styles.toggleText, tenantType === 'all' && styles.activeToggleText]}>All Tenant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggle, tenantType === 'select' && styles.activeToggle]}
            onPress={() => {
              setTenantType('select');
              setShowTenantDropdown(!showTenantDropdown);
            }}
          >
            <Text style={[styles.toggleText, tenantType === 'select' && styles.activeToggleText]}>Select Tenant</Text>
          </TouchableOpacity>
        </View>

        {tenantType === 'select' && selectedTenants.length > 0 && (
          <View style={styles.selectedContainer}>
            {selectedTenants.map((tenant) => (
              <View key={tenant.id} style={styles.selectedItem}>
                <Text style={styles.selectedText}>{tenant.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveTenant(tenant)}>
                  <Entypo name="cross" size={28} color="#4E4E5F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

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

        <View style={[styles.row, { justifyContent: 'flex-end', marginTop: 30 }]}>
          <TouchableOpacity  style={[styles.actionBtn, styles.closeBtn]}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]}>
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
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
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
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#75AB38',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedText: {
    color: '#fff',
    marginRight: 6,
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
});
