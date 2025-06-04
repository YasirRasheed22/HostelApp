import React, {useState} from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {
  Button,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
} from 'react-native-paper';

export default function AddTenant() {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [securityFee, setSecurityFee] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [cnic1, setCnic1] = useState('');
  const [relation, setRelation] = useState('');
  const [phone1, setPhone1] = useState('');

  const [gender, setGender] = useState(null);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const [maritalStatus, setMaritalStatus] = useState(null);
  const [maritalModalVisible, setMaritalModalVisible] = useState(false);

  const [jobTitle, setJobTitle] = useState(null);
  const [jobModalVisible, setJobModalVisible] = useState(false);

  const [room, setRoom] = useState(null);
  const [roomModalVisible, setRoomModalVisible] = useState(false);

  const [paymentDate, setPaymentDate] = useState(null);
  const [paymentDateModalVisible, setPaymentDateModalVisible] = useState(false);

  const [permanentAddress, setPermanentAddress] = useState('');
  const [state, setState] = useState('');
  const [occupationAddress, setOccupationAddress] = useState('');
  const [properties, setProperties] = useState([]);

  const handleAddProperty = () => {
    setProperties([...properties, '']);
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

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Tenant</Text>
        <View style={styles.separator} />

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
          />
          <TextInput
            label="CNIC/B-FORM"
            value={cnic}
            onChangeText={setCnic}
            style={styles.input}
          />
          <TextInput
            label="Phone No"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <TextInput
            label="E-Mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Security Fee"
            value={securityFee}
            onChangeText={setSecurityFee}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dropdown}>
            <Text style={{color: birthDate ? '#000' : '#888'}}>
              {birthDate ? birthDate.toDateString() : 'Choose Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setBirthDate(date);
              }}
            />
          )}

          {/* GENDER MODAL */}
          <TouchableOpacity
            onPress={() => setGenderModalVisible(true)}
            style={styles.genderSelector}>
            <Text style={{color: gender ? '#000' : '#888'}}>
              {gender || 'Select Gender'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={genderModalVisible}
              onDismiss={() => setGenderModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {['Male', 'Female', 'Other'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setGender(item);
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
            style={styles.genderSelector}>
            <Text style={{color: maritalStatus ? '#000' : '#888'}}>
              {maritalStatus || 'Select Marital Status'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={maritalModalVisible}
              onDismiss={() => setMaritalModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Marital Status</Text>
              {['Married', 'Single'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setMaritalStatus(item);
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
            value={permanentAddress}
            onChangeText={setPermanentAddress}
            style={styles.input}
          />
          <TextInput
            label="State"
            value={state}
            onChangeText={setState}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Occupation Information</Text>
          <TouchableOpacity
            onPress={() => setJobModalVisible(true)}
            style={styles.genderSelector}>
            <Text style={{color: jobTitle ? '#000' : '#888'}}>
              {jobTitle || 'Select Job Title'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={jobModalVisible}
              onDismiss={() => setJobModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Job Title</Text>
              {['Student', 'Teacher'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setJobTitle(item);
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
            value={occupationAddress}
            onChangeText={setOccupationAddress}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Room Information</Text>
          <TouchableOpacity
            onPress={() => setRoomModalVisible(true)}
            style={styles.genderSelector}>
            <Text style={{color: room ? '#000' : '#888'}}>
              {room || 'Select Room'}
            </Text>
          </TouchableOpacity>
          <Portal>
            <Modal
              visible={roomModalVisible}
              onDismiss={() => setRoomModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Room</Text>
              {['B-86', 'A-25'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setRoom(item);
                    setRoomModalVisible(false);
                  }}
                  style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Modal>
          </Portal>

          <TouchableOpacity
            onPress={() => setPaymentDateModalVisible(true)}
            style={styles.genderSelector}>
            <Text style={{color: paymentDate ? '#000' : '#888'}}>
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
            label="Room Rent"
            value={securityFee}
            onChangeText={setSecurityFee}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Guardian Information</Text>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => setModalVisible(true)}>
            Add Guardian
          </Button>

          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Guardian</Text>

              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />

              <TextInput
                label="CNIC"
                value={cnic1}
                onChangeText={setCnic1}
                style={styles.input}
                keyboardType="numeric"
              />

              <TextInput
                label="Relation"
                value={relation}
                onChangeText={setRelation}
                style={styles.input}
              />

              <TextInput
                label="Phone Number"
                value={phone1}
                onChangeText={setPhone1}
                style={styles.input}
                keyboardType="phone-pad"
              />

              <View style={styles.buttonRow}>
                <Button onPress={() => setModalVisible(false)}>Cancel</Button>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() => {
                    // You can handle save logic here
                    setModalVisible(false);
                  }}>
                  Save
                </Button>
              </View>
            </Modal>
          </Portal>

          <Text style={styles.sectionTitle}>Mess Information</Text>
          <Button style={styles.button} mode="contained">
            YES
          </Button>
          <Button style={styles.button2} mode="outlined">
            NO
          </Button>

          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={{ alignItems: 'flex-end', marginBottom: 17 }}>
            <Button
                style={styles.button3}
                mode="outlined"
                onPress={handleAddProperty}>
                Add +
            </Button>
            </View>

          {properties.map((property, index) => (
            <View key={index} style={styles.propertyItem}>
              <TextInput
                label={`Property ${index + 1}`}
                value={property}
                onChangeText={text => handlePropertyChange(text, index)}
                style={[styles.input, {flex: 1}]}
              />
              <TouchableOpacity
                onPress={() => handleRemoveProperty(index)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  dropdown: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#75AB38',
    borderRadius: 10,
  },
  button3: {
    backgroundColor: '#75AB38',
    width:'40%',
    borderRadius:10,

  },
  button2: {
    borderRadius: 10,
    // border:'#75AB38',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
