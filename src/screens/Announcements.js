import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Announcements () {
  const [selectedOption, setSelectedOption] = useState('');
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
        const db = await AsyncStorage.getItem('db_name');
        const payload = {
            db_name : db
        }
      const res = await axios.put(`${ApiUrl}/api/tenants`, payload); // Update with your API
      setTenants(res.data.data);
    } catch (err) {
      console.log('Failed to load tenants', err);
    }
  };

  useEffect(() => {
    filterTenants();
  }, [selectedOption]);

  const filterTenants = () => {
    if (selectedOption === 'active') {
      setFilteredTenants(tenants.filter(t => t.status === 'active'));
    } else if (selectedOption === 'inactive') {
      setFilteredTenants(tenants.filter(t => t.status === 'in-active'));
    } else {
      setFilteredTenants(tenants);
    }
  };

  const handleTenantSelect = (tenantId) => {
    if (selectedOption === 'guardian') {
      setSelectedTenants([tenantId]);
      setSelectedGuardian(null); // Reset guardian
    } else {
      setSelectedTenants(prev =>
        prev.includes(tenantId)
          ? prev.filter(id => id !== tenantId)
          : [...prev, tenantId]
      );
    }
  };

  const handleGuardianSelect = (guardianId) => {
    setSelectedGuardian(guardianId);
  };

  const handleSave = () => {
    const payload = {
      type: selectedOption,
      tenants: selectedTenants,
      guardian: selectedGuardian,
      message,
    };
    console.log('Saving...', payload);
    // axios.post('http://your-api/announcements', payload);
  };

  const renderRadio = (value, label) => (
    <TouchableOpacity onPress={() => setSelectedOption(value)} style={styles.radioContainer}>
      <View style={styles.radio}>
        {selectedOption === value && <View style={styles.selectedRadio} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderTenantCheckbox = (tenant) => (
    <TouchableOpacity
      key={tenant.id}
      onPress={() => handleTenantSelect(tenant.id)}
      style={styles.checkboxContainer}
    >
      <View style={styles.checkbox}>
        {selectedTenants.includes(tenant.id) && <View style={styles.checked} />}
      </View>
      <Text>{tenant.name}</Text>
    </TouchableOpacity>
  );

  const renderGuardianOptions = () => {
    const tenant = tenants.find(t => t.id === selectedTenants[0]);
    if (!tenant || tenant.guardian.length === 0) return null;

    return tenant.guardian.map(guardian => (
      <TouchableOpacity
        key={guardian.id}
        onPress={() => handleGuardianSelect(guardian.id)}
        style={styles.checkboxContainer}
      >
        <View style={styles.checkbox}>
          {selectedGuardian === guardian.id && <View style={styles.checked} />}
        </View>
        <Text>{guardian.name} - {guardian.relation}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Push Announcements</Text> */}
      <View style={styles.radioGroup}>
        {renderRadio('all', 'Send to All Tenants')}
        {renderRadio('send_to_active', 'Send to Active Tenants')}
        {renderRadio('send_to_inactive', 'Send to Inactive Tenants')}
        {renderRadio('send_to_specific', 'Send to Specific')}
        {renderRadio('guardian', 'Send to Tenant Guardian')}
      </View>

      {(selectedOption === 'specific' || selectedOption === 'guardian') && (
        <View style={styles.dropdown}>
          <Text style={styles.label}>Select Tenant(s)</Text>
          {filteredTenants.map(renderTenantCheckbox)}
        </View>
      )}

      {selectedOption === 'guardian' && (
        <View style={styles.dropdown}>
          <Text style={styles.label}>Select Guardian</Text>
          {renderGuardianOptions()}
        </View>
      )}

      {selectedOption !== '' && (
        <TextInput
          style={styles.textArea}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      )}

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#75AB38',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4caf50',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    marginBottom: 20,
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#4caf50',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#75AB38',
    borderRadius: 2,
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#75AB38',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
