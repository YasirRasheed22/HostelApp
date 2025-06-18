import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiUrl} from '../../config/services';
import axios from 'axios';
import {font} from '../components/ThemeStyle';

const facilitiesList = [
  'AC',
  'Heater',
  'Carpet',
  'Mirror',
  'Iron',
  'Tub',
  'Mope',
  'Cupboard',
  'Fridge',
  'Others',
];

export default function EditRoom() {
  const route = useRoute();
  const {id} = route.params;
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [rooms, setRoom] = useState([]);

  const [otherFacility, setOtherFacility] = useState('');

  const toggleFacility = item => {
    const exists = selectedFacilities.includes(item);
    if (exists) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== item));
      setCheckAll(false);
    } else {
      const updated = [...selectedFacilities, item];
      setSelectedFacilities(updated);
      setCheckAll(updated.length === facilitiesList.length);
    }
  };

  const handleSave = async () => {
    const db = await AsyncStorage.getItem('db_name');

    // Replace 'Others' with the user-provided value
    let finalFacilities = [...selectedFacilities];
    if (finalFacilities.includes('Others') && otherFacility.trim() !== '') {
      finalFacilities = finalFacilities.map(f =>
        f === 'Others' ? otherFacility.trim() : f,
      );
    }

    // Stringify the array as a proper JSON array string
    const facilitiesString = JSON.stringify(finalFacilities);

    const payload = {
      name: rooms.name,
      capacity: parseInt(rooms.capacity),
      per_person: parseFloat(rooms.per_person),
      floor_name: rooms.floor_name,
      facilities: facilitiesString, // ✅ This is like '["Heater","AC"]'
      db_name: db,
    };

    try {
      console.log('Payload:', payload);
      const response = await axios.put(
        `${ApiUrl}/api/rooms/update/${id}`,
        payload,
      );
      console.log('Edit API response:', response.data);
      Alert.alert('Room Updated Successfully');
    } catch (error) {
      console.log('Error while saving:', error.message);
      Alert.alert('Something went wrong... try again');
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

  useEffect(() => {
    const fetchRoom = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {db_name: db};

      try {
        const response = await axios.put(
          `${ApiUrl}/api/rooms/single/${id}`,
          payload,
        );
        const roomData = response.data;
        setRoom(roomData);

        // ✅ Parse facilities from JSON string to array
        let facilities = [];
        try {
          facilities = JSON.parse(roomData.facilities);
        } catch (e) {
          console.warn('Facilities parse error:', e.message);
          facilities = [];
        }

        // ✅ Detect if there's a custom "Others" facility
        const others = facilities.find(f => !facilitiesList.includes(f));
        if (others) {
          setOtherFacility(others);
          facilities = facilities.map(f =>
            !facilitiesList.includes(f) ? 'Others' : f,
          );
        }

        setSelectedFacilities(facilities);
        setCheckAll(facilities.length === facilitiesList.length);
      } catch (error) {
        console.log('Error fetching room:', error.message);
      }
    };

    fetchRoom();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.titleRow}>
        <Text style={styles.title}>Add Room</Text>
      </View>
      <View style={styles.separator} /> */}
      <Text style={styles.sectionTitle}>Room Information</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="ROOM NO"
          value={rooms.name}
          onChangeText={text => setRoom(prev => ({...prev, name: text}))}
          style={styles.input}
        />
        <TextInput
          placeholder="PEOPLE CAPACITY"
          value={String(rooms.capacity)}
          onChangeText={text => setRoom(prev => ({...prev, capacity: text}))}
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="PER PERSON AMOUNT"
          value={String(rooms.per_person)}
          onChangeText={text => setRoom(prev => ({...prev, per_person: text}))}
          style={styles.input}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={rooms.floor_name}
            onValueChange={text =>
              setRoom(prev => ({...prev, floor_name: text}))
            }
            style={styles.picker}>
            <Picker.Item label="Floor No" value="" />
            <Picker.Item label="Basement" value="basement" />
            <Picker.Item label="Ground" value="ground" />
            <Picker.Item label="Floor 1" value="1" />
            <Picker.Item label="Floor 2" value="2" />
            <Picker.Item label="Floor 4" value="4" />
            <Picker.Item label="Floor 5" value="5" />
            <Picker.Item label="Floor 3" value="3" />
            <Picker.Item label="Floor 6" value="6" />
            <Picker.Item label="Floor 7" value="7" />
            <Picker.Item label="Floor 8" value="8" />
            <Picker.Item label="Floor 9" value="9" />
            <Picker.Item label="Floor 10" value="10" />
            <Picker.Item label="Floor 11" value="11" />
            <Picker.Item label="Floor 12" value="12" />
            <Picker.Item label="Floor 13" value="13" />
            <Picker.Item label="Floor 14" value="14" />
            <Picker.Item label="Floor 15" value="15" />
            <Picker.Item label="Floor 16" value="16" />
            <Picker.Item label="Floor 17" value="17" />
            <Picker.Item label="Floor 18" value="18" />
            <Picker.Item label="Floor 19" value="19" />
            <Picker.Item label="Floor 20" value="20" />
          </Picker>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Facilities</Text>

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

        {selectedFacilities.includes('Others') && (
          <TextInput
            placeholder="Enter other facility"
            value={otherFacility}
            onChangeText={setOtherFacility}
            style={[styles.input, {width: '100%'}]}
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
    color: '#75AB38',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    // flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    width: '160',
    height: '50',
    padding: 5,
  },
  pickerWrapper: {
    // flex: 1,
    width: '160',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    color: '#808080',
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  facilitiesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
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
  title: {
    fontSize: 25,
    marginBottom: 10,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
});
