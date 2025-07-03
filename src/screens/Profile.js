import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../components/CustomAlert';

export default function Profile() {
  const [viewMode, setViewMode] = useState(true);
  const [id, setId] = useState();
  const [db, setDb] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currPassword, setCurrentPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [rights, setRights] = useState({});
  const [data, setData] = useState({
    fullName: '',
    cnic: '',
    email: '',
    phone: '',
    emergency_contact: '',
    salary: '',
    db_name: '',
    payout_date: '',
    password: '',
    profile_image: '',
  });

  useEffect(() => {
    const fetchstaff = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const user = await AsyncStorage.getItem('user');
        const id = JSON.parse(user);

        setDb(db);
        setId(id?.id);

        const response = await axios.put(`${ApiUrl}/api/users/single/${id?.id}`, {
          db_name: db,
        });

        setRights(response.data?.users?.rights);
        setData(response.data?.users);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchstaff();
  }, []);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };


  const handleSave = async() => {
    setLoading(true)
    const payload = {
         fullName: data.fullName,
        cnic: data.cnic,
        // email: data.email,
        phone: data.phone,
        emergency_contact: data.emergency_contact,
        salary: data.salary,
        db_name: db,
        payout_date: data.payout_date,
        profile_image: data.profile_image,
    }
    try {
        console.log(payload , id)
        const response = await axios.put(`${ApiUrl}/api/users/update-by-user/${id}`, payload)
        console.log(response);
    } catch (error) {
        console.log(error.message)
    }finally{
        setLoading(false)
    }
  }
  const handlePress = async () => {
    setLoading(true);
    try {
      const payload = {
        user_id: id,
        currentPassword: currPassword,
        newPassword: newPassword,
        db_name: db,
      };

      const response = await axios.post(`${ApiUrl}/api/users/update-password`, payload);
      setModalType('success');
      setModalMessage('Password Changed');
      setModalVisible(true);
    } catch (error) {
      setModalType('danger');
      setModalMessage('Invalid Current Password');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderTabButton = (label, key) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === key && styles.activeTab]}
      onPress={() => setActiveTab(key)}
    >
      <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.row}>
        {viewMode ? (
          <>
           {['fullName', 'cnic', 'email', 'phone', 'emergency_contact', 'salary', 'payout_date'].map((field, index) => (
      <View key={index}>
        <Text style={styles.label}>
          {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Text>
        <Text style={styles.text}>
          {data?.[field] ? data[field] : 'No'}
        </Text>
      </View>
    ))}
          </>
        ) : (
          <>
            {['fullName', 'cnic', 'phone', 'emergency_contact', 'salary', 'payout_date'].map((field, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={data?.[field]}
                onChangeText={text => handleChange(field, text)}
                placeholder={field.replace(/_/g, ' ')}
              />
            ))}
          </>
        )}
      </View>

       {!viewMode && (
              <View style={styles.btn}>
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  color="#75AB38"
                />
              </View>
            )}

      <Button
        title={viewMode ? 'Edit Mode' : 'View Mode'}
        onPress={() => setViewMode(prev => !prev)}
        color="#75AB38"
      />
    </View>
  );

  const renderGuardianInfo = () => (
    <View style={styles.card}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Access Rights:</Text>
      <View style={styles.rightsContainer}>
        {Object.entries(rights).map(([key, value]) => (
          <View key={key} style={styles.rightsRow}>
            <Text style={styles.rightLabel}>
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
            <Text style={[styles.rightStatus, { color: value ? 'green' : 'red' }]}>
              {value ? 'Enabled ✅' : 'Disabled ❌'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderFeeTimeline = () => (
    <View style={styles.card}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Change Password:</Text>

      <View style={styles.passwordField}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={currPassword}
          onChangeText={setCurrentPass}
          placeholder="Current Password"
          secureTextEntry={!showCurrentPassword}
        />
        <Feather
          name={showCurrentPassword ? 'eye-off' : 'eye'}
          size={20}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          style={{ marginLeft: 10 }}
        />
      </View>

      <View style={styles.passwordField}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
        />
        <Feather
          name={showNewPassword ? 'eye-off' : 'eye'}
          size={20}
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={{ marginLeft: 10 }}
        />
      </View>

      <View style={styles.btn}>
        <Button title="Save Changes" onPress={handlePress} color="#75AB38" />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tabContainer}>
        {renderTabButton('Personal Info', 'overview')}
        {renderTabButton('Rights', 'guardian')}
        {renderTabButton('Password', 'fees')}
      </View>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'guardian' && renderGuardianInfo()}
      {activeTab === 'fees' && renderFeeTimeline()}

      <AlertModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        message={modalMessage}
        type={modalType}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75AB38',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'green',
  },
  tabText: {
    color: 'black',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  text: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  btn: {
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  rightsContainer: {
    marginTop: 10,
  },
  rightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  rightLabel: {
    fontWeight: '500',
    color: '#444',
  },
  rightStatus: {
    fontWeight: '600',
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
