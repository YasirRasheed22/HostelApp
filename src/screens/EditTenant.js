import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {
  Button,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
} from 'react-native-paper';
import { font } from '../components/ThemeStyle';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import axios from 'axios';
import AlertModal from '../components/CustomAlert';

export default function EditTenant() {
  const route = useRoute();
  const { id } = route.params;
  const [user, setUser] = useState({
    name: '',
    cnic: '',
    phone: '',
    email: '',
    dob: new Date(),
    gender: '',
    securityFees: '',
    marital_status: '',
    permanent_address: '',
    state: '',
    job_title: '',
    job_location: '',
    mess_title: '',
    mess_price: '',
    room: null,
    paymentCycleDate: '',
    rentForRoom: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletedGuardians, setDeletedGuardians] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [fullName, setFullName] = useState('');
  const [cnic1, setCnic1] = useState('');
  const [relation, setRelation] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger');
  const [phone1, setPhone1] = useState('');
  const [roomRent, setRoomRent] = useState('');
  const [messStatus, setMessStatus] = useState('no');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [maritalModalVisible, setMaritalModalVisible] = useState(false);
  const [jobModalVisible, setJobModalVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [paymentDateModalVisible, setPaymentDateModalVisible] = useState(false);
  const [properties, setProperties] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [room, setRoom] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigation = useNavigation();

  const isFocussed = useIsFocused()
  useEffect(() => {
    const fetchUser = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = { db_name: db };
      try {
        const response = await axios.post(`${ApiUrl}/api/tenants/single/${id}`, payload);
        const tenant = response.data.tenant;

        const loadedProperties = tenant.property_info
          ? JSON.parse(tenant.property_info)
          : [];

        setProperties(loadedProperties);
        setSelectedImage(tenant.profile_image);
        setUser({
          ...tenant,
          dob: tenant.dob ? new Date(tenant.dob) : new Date(),
        });
        setMessStatus(tenant.mess_status || 'no');

        // Load guardians with their IDs
        setGuardians(tenant.guardian?.map(g => ({
          id: g.id,
          name: g.name,
          cnic: g.cnic,
          phone: g.phone,
          relation: g.relation
        })) || []);

        setRoom(tenant.room?.id || null);
        setRoomRent(String(tenant.rentForRoom || ''));
        setPaymentDate(String(tenant.paymentCycleDate || ''));

        // Fetch available rooms
        const roomsResponse = await axios.put(`${ApiUrl}/api/rooms`, payload);
        setAvailableRooms(roomsResponse.data.data);
      } catch (error) {
        console.log('Error fetching user:', error.message);
        setModalType('danger');
        setModalMessage('Failed to load tenant data');
        setModalVisible(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, isFocussed]);

  const handleImagePick = () => {
    Alert.alert('Choose Option', 'Camera or Gallery', [
      { text: 'Take Photo', onPress: handleCameraLaunch },
      { text: 'Choose Gallery', onPress: openImagePicker },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      const uri = response.assets?.[0]?.uri;
      if (uri) setSelectedImage(uri);
    });
  };

  const handleCameraLaunch = async () => {
    if (!(await requestCameraPermission())) {
      Alert.alert('Permission Denied', 'Camera access is required');
      return;
    }
    launchCamera({ mediaType: 'photo' }, response => {
      const uri = response.assets?.[0]?.uri;
      if (uri) setSelectedImage(uri);
    });
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    const db = await AsyncStorage.getItem('db_name');
    const formData = new FormData();

    // Basic tenant info
    formData.append('name', user.name || '');
    formData.append('phone', user.phone || '');
    formData.append('cnic', user.cnic || '');
    formData.append('email', user.email || '');
    formData.append('dob', user.dob?.toString() || '');
    formData.append('gender', user.gender?.toString() || '');
    formData.append('securityFees', user.securityFees || '');
    formData.append('marital_status', user.marital_status?.toString() || '');
    formData.append('permanent_address', user.permanent_address || '');
    formData.append('db_name', db || '');
    formData.append('state', user.state || '');
    formData.append('job_title', user.job_title?.toString() || '');
    formData.append('job_location', user.job_location || '');
    formData.append('paymentCycleDate', paymentDate || user.paymentCycleDate || '');
    formData.append('rentForRoom', roomRent || user.rentForRoom || '');
    formData.append('roomId', room || user.room?.id || '');
    formData.append('mess_status', messStatus || '');
    formData.append('mess_title', user.mess_title || '');
    formData.append('mess_price', user.mess_price || '');

    // Handle guardians - preserve existing and add new
    guardians.forEach((guardian, index) => {
      if (guardian.id) {
        formData.append(`guardians[${index}][id]`, guardian.id);
      }
      formData.append(`guardians[${index}][name]`, guardian.name);
      formData.append(`guardians[${index}][cnic]`, guardian.cnic);
      formData.append(`guardians[${index}][phone]`, guardian.phone);
      formData.append(`guardians[${index}][relation]`, guardian.relation);
    });

    formData.append('property_info', JSON.stringify(properties));

    if (selectedImage && !selectedImage.startsWith('http')) {
      formData.append('profile_image', {
        uri: selectedImage,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      if (deletedGuardians.length > 0) {
        await Promise.all(
          deletedGuardians.map(async (id) => {
            try {
              const res = await axios.delete(`${ApiUrl}/api/tenants/guardian/${id}`, {
                data: { db_name: db }
              });
              console.log(res)
            } catch (error) {
              console.error('Error deleting guardian:', error);
              // Continue even if deletion fails for some
            }
          })
        );
      }
      const response = await axios.put(`${ApiUrl}/api/tenants/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setModalType('success');
      setModalMessage('Tenant updated successfully');
      setModalVisible(true);
      navigation.goBack();
    } catch (error) {
      console.log('Error:', error?.response?.data || error.message);
      setModalType('danger');
      setModalMessage(error?.response?.data?.message || 'Failed to update tenant');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuardian = () => {
    if (!fullName || !cnic1 || !phone1 || !relation) {
      setModalType('danger');
      setModalMessage('Please fill all guardian fields');
      setModalVisible(true);
      return;
    }

    // Check for duplicate CNIC
    if (guardians.some(g => g.cnic === cnic1)) {
      setModalType('danger');
      setModalMessage('Guardian with this CNIC already exists');
      setModalVisible(true);
      return;
    }

    setGuardians(prev => [...prev, {
      name: fullName,
      cnic: cnic1,
      phone: phone1,
      relation
      // Note: No ID for new guardians
    }]);

    // Reset form
    setFullName('');
    setCnic1('');
    setPhone1('');
    setRelation('');
    setModalVisible1(false);
  };

  const handleRemoveGuardian = async (index) => {
    const guardianToRemove = guardians[index];

    // If it's an existing guardian (has ID), add to deleted list
    if (guardianToRemove.id) {
      setDeletedGuardians(prev => [...prev, guardianToRemove.id]);
    }

    // Remove from local state
    const updatedGuardians = [...guardians];
    updatedGuardians.splice(index, 1);
    setGuardians(updatedGuardians);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handlePropertyChange = (text, index) => {
    const updated = [...properties];
    updated[index] = text;
    setProperties(updated);
  };

  const handleRemoveProperty = index => {
    const updated = properties.filter((_, i) => i !== index);
    setProperties(updated);
  };

  const handleAddProperty = () => {
    setProperties([...properties, '']);
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }
  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <AlertModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          message={modalMessage}
          type={modalType}
        />
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePick}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.roundImage} />
            ) : (
              <View style={styles.iconCircle}>
                <EvilIcons name="image" size={50} color="#888" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ gap: 12 }}>
          <TextInput
            label="Full Name"
            value={user.name}
            onChangeText={(text) => setUser(prev => ({ ...prev, name: text }))}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="CNIC/B-FORM"
            value={user.cnic}
            onChangeText={(text) => setUser(prev => ({ ...prev, cnic: text }))}
            style={styles.input}
            keyboardType="numeric"
            underlineColor="transparent"
          />
          <TextInput
            label="Phone No"
            value={user.phone}
            onChangeText={(text) => setUser(prev => ({ ...prev, phone: text }))}
            style={styles.input}
            keyboardType="numeric"
            underlineColor="transparent"
          />
          <TextInput
            label="E-Mail"
            value={user.email}
            onChangeText={(text) => setUser(prev => ({ ...prev, email: text }))}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="Security Fee"
            value={String(user.securityFees)}
            onChangeText={(text) => setUser(prev => ({ ...prev, securityFees: text }))}
            style={styles.input}
            keyboardType='numeric'
            underlineColor="transparent"
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.field}
          >
            <Text style={styles.fieldText}>
              {user.dob
                ? (() => {
                  const date = new Date(user.dob);
                  return `${date.getDate().toString().padStart(2, '0')}-${(
                    date.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, '0')}-${date.getFullYear()}`;
                })()
                : 'Choose Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={user.dob || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setUser(prev => ({ ...prev, dob: date }));
                }
              }}
            />
          )}

          {/* GENDER MODAL */}
          <TouchableOpacity
            onPress={() => setGenderModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>{user.gender || 'Select Gender'}</Text>
          </TouchableOpacity>

          <Portal>
            <Modal
              visible={genderModalVisible}
              onDismiss={() => setGenderModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {['male', 'female', 'other'].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setUser(prev => ({ ...prev, gender: item }));
                    setGenderModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Modal>
          </Portal>

          {/* Marital Status */}
          <TouchableOpacity
            onPress={() => setMaritalModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>
              {user.marital_status || 'Select Marital Status'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={maritalModalVisible}
              onDismiss={() => setMaritalModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Marital Status</Text>
              {['married', 'single'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setUser(prev => ({ ...prev, marital_status: item }));
                    setMaritalModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Modal>
          </Portal>

          <Text style={styles.sectionTitle}>Address Information</Text>
          <TextInput
            label="Permanent Address"
            value={user.permanent_address}
            onChangeText={(text) => setUser(prev => ({ ...prev, permanent_address: text }))}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="State"
            value={user.state}
            onChangeText={(text) => setUser(prev => ({ ...prev, state: text }))}
            style={styles.input}
            underlineColor="transparent"
          />

          <Text style={styles.sectionTitle}>Occupation Information</Text>
          <TouchableOpacity
            onPress={() => setJobModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>
              {user.job_title || 'Select Job Title'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={jobModalVisible}
              onDismiss={() => setJobModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Job Title</Text>
              {['student', 'teacher', 'employee', 'business'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setUser(prev => ({ ...prev, job_title: item }));
                    setJobModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Modal>
          </Portal>
          <TextInput
            label="Address"
            value={user.job_location}
            onChangeText={(text) => setUser(prev => ({ ...prev, job_location: text }))}
            style={styles.input}
            underlineColor="transparent"
          />

          <Text style={styles.sectionTitle}>Room Information</Text>
          <TouchableOpacity
            onPress={() => setRoomModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>
              {availableRooms.find(r => r.id === room)?.name || 'Select Room'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={roomModalVisible}
              onDismiss={() => setRoomModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Room</Text>
              {availableRooms.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setRoom(item.id);
                    setRoomModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </Modal>
          </Portal>

          <TouchableOpacity
            onPress={() => setPaymentDateModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>
              {paymentDate || user.paymentCycleDate || 'Select Payment Date'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={paymentDateModalVisible}
              onDismiss={() => setPaymentDateModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>

              <Text style={styles.modalTitle}>Select Payment Date</Text>

              <ScrollView style={{ maxHeight: 200 }}>
                {Array.from({ length: 30 }, (_, i) =>
                  (i + 1).toString().padStart(2, '0'),
                ).map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setPaymentDate(item);
                      setPaymentDateModalVisible(false);
                    }}
                    style={styles.modalItem}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

            </Modal>
          </Portal>

          <TextInput
            label="Room Rent"
            value={roomRent || String(user.rentForRoom)}
            onChangeText={setRoomRent}
            style={styles.input}
            underlineColor="transparent"
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Guardian Information</Text>

          {guardians.map((guardian, index) => (
            <View key={index} style={styles.guardianItem}>
              <Text>Name: {guardian.name}</Text>
              <Text>CNIC: {guardian.cnic}</Text>
              <Text>Phone: {guardian.phone}</Text>
              <Text>Relation: {guardian.relation}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveGuardian(index)}>
                <Text style={styles.deleteButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Button
            style={styles.button}
            mode="contained"
            onPress={() => setModalVisible1(true)}>
            Add Guardian
          </Button>

          <Portal>
            <Modal
              visible={modalVisible1}
              onDismiss={() => setModalVisible1(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Guardian</Text>

              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                underlineColor="transparent"
              />

              <TextInput
                label="CNIC"
                value={cnic1}
                onChangeText={setCnic1}
                style={styles.input}
                keyboardType="numeric"
                underlineColor="transparent"
              />

              <TextInput
                label="Phone Number"
                value={phone1}
                onChangeText={setPhone1}
                style={styles.input}
                keyboardType="phone-pad"
                underlineColor="transparent"
              />

              <TextInput
                label="Relation"
                value={relation}
                onChangeText={setRelation}
                style={styles.input}
                underlineColor="transparent"
              />

              <View style={styles.buttonRow}>
                <Button onPress={() => setModalVisible1(false)}>Cancel</Button>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={handleAddGuardian}>
                  Save
                </Button>
              </View>
            </Modal>
          </Portal>

          <Text style={styles.sectionTitle}>Mess Information</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={[
                styles.button1,
                messStatus === 'yes'
                  ? { backgroundColor: '#75AB38' }
                  : { backgroundColor: '#fff', borderWidth: 1, borderColor: '#75AB38' },
              ]}
              onPress={() => setMessStatus('yes')}>
              <Text style={{ color: messStatus === 'yes' ? '#fff' : '#75AB38' }}>YES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button2,
                messStatus === 'no'
                  ? { backgroundColor: '#75AB38' }
                  : { backgroundColor: '#fff', borderWidth: 1, borderColor: '#75AB38' },
              ]}
              onPress={() => setMessStatus('no')}>
              <Text style={{ color: messStatus === 'no' ? '#fff' : '#75AB38' }}>NO</Text>
            </TouchableOpacity>
          </View>
          {messStatus === 'yes' ? (
            <>
              <TextInput
                label="Mess Title"
                value={user.mess_title}
                onChangeText={(text) => setUser(prev => ({ ...prev, mess_title: text }))}
                style={styles.input}
                underlineColor="transparent"
              />
              <TextInput
                label="Mess Price"
                value={user.mess_price}
                onChangeText={(text) => setUser(prev => ({ ...prev, mess_price: text }))}
                style={styles.input}
                underlineColor="transparent"
                keyboardType="numeric"
              />
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={{ alignItems: 'flex-end', marginBottom: 17 }}>
            <TouchableOpacity
              style={styles.button3}
              onPress={handleAddProperty}>
              <Text style={styles.buttonText}>Add +</Text>
            </TouchableOpacity>
          </View>

          {properties.map((property, index) => (
            <View key={index} style={styles.propertyItem}>
              <TextInput
                label={`Property ${index + 1}`}
                value={property}
                onChangeText={text => handlePropertyChange(text, index)}
                style={[styles.input, { flex: 1 }]}
                underlineColor="transparent"
              />
              <TouchableOpacity
                onPress={() => handleRemoveProperty(index)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveBtnText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F9F9F9',
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: font.secondary,
    color: '#75AB38',
    marginVertical: 10,
  },
  input: {
    padding: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roundImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#75AB38',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#75AB38',
    borderRadius: 10,
    marginVertical: 10,
  },
  button1: {
    backgroundColor: '#75AB38',
    padding: 10,
    width: '30%',
    alignItems: 'center',
    borderRadius: 10,
  },
  button3: {
    backgroundColor: '#75AB38',
    width: '40%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  button2: {
    padding: 10,
    width: '30%',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#75AB38',
  },
  activeButton: {
    backgroundColor: '#75AB38',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  guardianItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#75AB38',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: font.secondary,
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
  buttonText: {
    color: '#fff',
  },
});