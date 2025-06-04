import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

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

export default function AddRoom() {
  const [roomNo, setRoomNo] = useState('');
  const [capacity, setCapacity] = useState('');
  const [amount, setAmount] = useState('');
  const [floor, setFloor] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
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

  const toggleAll = () => {
    if (checkAll) {
      setSelectedFacilities([]);
      setCheckAll(false);
    } else {
      setSelectedFacilities(facilitiesList);
      setCheckAll(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Add Room</Text>
      </View>
      <View style={styles.separator} />
      <Text style={styles.sectionTitle}>Room Information</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="ROOM NO"
          value={roomNo}
          onChangeText={setRoomNo}
          style={styles.input}
        />
        <TextInput
          placeholder="PEOPLE CAPACITY"
          value={capacity}
          onChangeText={setCapacity}
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="PER PERSON AMOUNT"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={floor}
            onValueChange={itemValue => setFloor(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Floor No" value="" />
            <Picker.Item label="Basement" value="basement" />
            <Picker.Item label="Ground" value="ground" />
            <Picker.Item label="Floor 1" value="floor1" />
            <Picker.Item label="Floor 2" value="floor2" />
            <Picker.Item label="Floor 3" value="floor3" />
            <Picker.Item label="Floor 4" value="floor4" />
            <Picker.Item label="Floor 5" value="floor5" />
            <Picker.Item label="Floor 6" value="floor6" />
            <Picker.Item label="Floor 7" value="floor7" />
            <Picker.Item label="Floor 8" value="floor8" />
            <Picker.Item label="Floor 9" value="floor9" />
            <Picker.Item label="Floor 10" value="floor10" />
            <Picker.Item label="Floor 11" value="floor11" />
            <Picker.Item label="Floor 12" value="floor12" />
            <Picker.Item label="Floor 13" value="floor13" />
            <Picker.Item label="Floor 14" value="floor14" />
            <Picker.Item label="Floor 15" value="floor15" />
            <Picker.Item label="Floor 16" value="floor16" />
            <Picker.Item label="Floor 17" value="floor17" />
            <Picker.Item label="Floor 18" value="floor18" />
            <Picker.Item label="Floor 19" value="floor19" />
            <Picker.Item label="Floor 20" value="floor20" />
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

      <TouchableOpacity style={styles.saveBtn}>
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
    fontWeight: 'bold',
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
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
});
