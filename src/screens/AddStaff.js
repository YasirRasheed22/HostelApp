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
} from 'react-native';
import React, {useState} from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Modal, PaperProvider, Portal, TextInput} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import {font} from '../components/ThemeStyle';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const facilitiesList = [
  'Tenants',
  'Staff',
  'Reports',
  'Rooms',
  'Assets',
  'Attendance',
  'Accounts',
];

export default function AddStaff() {
  const [selectedImage, setSelectedImage] = useState();
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [role, setRole] = useState('');
  const [paymentDateModalVisible, setPaymentDateModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const navigation = useNavigation();

  navigation.setOptions({
    headerTitle: 'Add Staff',
    headerTitleStyle: {fontSize: 15, fontFamily: font.secondary},
    //  headerRight:()=>{
    //          return(
    //            <View style={{ flexDirection: 'row' }}>
    //           <TouchableOpacity onPress={toggleView} style={styles.topIcon}>
    //               <AntDesign name="retweet" size={22} color="#fff" />
    //             </TouchableOpacity>
    //           <TouchableOpacity onPress={()=>navigation.navigate('AddTenant')} style={styles.topIcon}>
    //             <AntDesign name="adduser" size={22} color="#fff" />
    //           </TouchableOpacity>
    //           </View>
    //          );
    //  }
  });

  const toggleFacility = item => {
    const exists = selectedFacilities.includes(item);
    if (exists) {
      const updated = selectedFacilities.filter(f => f !== item);
      setSelectedFacilities(updated);
      setCheckAll(false);
    } else {
      const updated = [...selectedFacilities, item];
      setSelectedFacilities(updated);
      setCheckAll(updated.length === facilitiesList.length);
    }
  };

  const toggleAll = () => {
    if (checkAll) {
      setSelectedFacilities([]);
      setCheckAll(false);
    } else {
      setSelectedFacilities(facilitiesList);
      setCheckAll(true);
    }
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

  const handleImagePick = () => {
    Alert.alert('Choose Option', 'Camera or Gallery', [
      {text: 'Take Photo', onPress: handleCameraLaunch},
      {text: 'Choose Gallery', onPress: openImagePicker},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const openImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      const uri = response.assets?.[0]?.uri;
      if (uri) setSelectedImage(uri);
    });
  };

  const handleCameraLaunch = async () => {
    if (!(await requestCameraPermission())) {
      Alert.alert('Permission Denied', 'Camera access is required');
      return;
    }
    launchCamera({mediaType: 'photo'}, response => {
      const uri = response.assets?.[0]?.uri;
      if (uri) setSelectedImage(uri);
    });
  };

  const handleSave = async () => {
    if (!name || !phone || !role || !password || password !== confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all fields correctly.');
      return;
    }
    const db_name =  await AsyncStorage.getItem('db_name');
    const formData = new FormData();

    formData.append('fullName', name);
    formData.append('cnic', cnic);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('salary', salary);
    formData.append('paymentCycle', paymentDate);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('db_name', db_name);
    formData.append('emergency_contact', emergencyContact);
    formData.append('profile_image', {
      uri: selectedImage, 
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

  const privilegesObj = {};
facilitiesList.forEach(item => {
  privilegesObj[item.toLowerCase()] = selectedFacilities.includes(item);
});
formData.append('privileges', JSON.stringify(privilegesObj));


    try {
      console.log(formData);
      const response = await axios.post(`${ApiUrl}/api/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }

    // Handle save logic here (API call or local state)
    Alert.alert('Success', 'Staff member added!');
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>Add staff</Text>
        <View style={styles.separator} /> */}

        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePick}>
            {selectedImage ? (
              <Image source={{uri: selectedImage}} style={styles.roundImage} />
            ) : (
              <View style={styles.iconCircle}>
                <EvilIcons name="image" size={50} color="#888" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={{gap: 12}}>
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="CNIC/B-FORM"
            value={cnic}
            onChangeText={setCnic}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="Phone No"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="E-Mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            underlineColor="transparent"
          />
          <TextInput
            label="Salary"
            value={salary}
            onChangeText={setSalary}
            style={styles.input}
            underlineColor="transparent"
          />

          <TouchableOpacity
            onPress={() => setPaymentDateModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>
              {paymentDate || 'Select Payment Date'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={paymentDateModalVisible}
              onDismiss={() => setPaymentDateModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Payment Date</Text>
              {['01', '02', '03'].map(item => (
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
            </Modal>
          </Portal>

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            underlineColor="transparent"
            style={styles.input}
          />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            underlineColor="transparent"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setRoleModalVisible(true)}
            style={styles.field}>
            <Text style={styles.fieldText}>{role || 'Select Role'}</Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={roleModalVisible}
              onDismiss={() => setRoleModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Role</Text>
              {['admin', 'user'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setRole(item);
                    setRoleModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Modal>
          </Portal>

          <TextInput
            label="Emergency Contact"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            style={styles.input}
            underlineColor="transparent"
          />

          <Text style={styles.sectionTitle}>Access Control</Text>

          <View style={styles.checkboxRow}>
            <View style={styles.checkboxItem}>
              <CheckBox value={checkAll} onValueChange={toggleAll} />
              <Text style={styles.checkboxLabel}>Check All</Text>
            </View>
          </View>

          <View style={styles.facilitiesWrapper}>
            {facilitiesList.map((item, index) => (
              <View key={index} style={styles.checkboxItem}>
                <CheckBox
                  value={selectedFacilities.includes(item)}
                  onValueChange={() => toggleFacility(item)}
                />
                <Text style={styles.checkboxLabel}>{item}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
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
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderSelector: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
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
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginVertical: 6,
  },
  checkboxLabel: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: font.primary,
  },
  facilitiesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: '#75AB38',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: 'bold',
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
    height: 60, // Uniform height
    justifyContent: 'center',
  },
  fieldText: {
    color: '#333',
    fontSize: 16,
  },
});
