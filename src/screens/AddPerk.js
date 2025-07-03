import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AlertModal from '../components/CustomAlert';

export default function AddPerk() {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [perkType, setPerkType] = useState('');

    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        const db = await AsyncStorage.getItem('db_name');
        const payload = {
            db_name: db,
            affectedDate : date,
            perk_type : perkType,
            price: price,
            status : status,
            title: title
        };
        console.log(payload);
        try {
            const response = await axios.post(`${ApiUrl}/api/fees/perk/create`, payload);
            console.log(response.data);
            setLoading(false);
              setModalType('success');
        setModalMessage('Perk created Successfully');
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
        <Provider>
            <View style={styles.container}>
                 <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />

                <Pressable onPress={() => setShowTypeDropdown(!showTypeDropdown)} style={styles.input}>
                    <Text style={styles.dropdownText}>{perkType || 'Select Type'}</Text>
                </Pressable>
                {showTypeDropdown && (
                    <View style={styles.dropdown}>
                        {['fixed', 'not-fixed'].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setPerkType(item);
                                    setShowTypeDropdown(false);
                                }}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TextInput
                    placeholder="Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <Text style={styles.label}>Select Implement Date</Text>
                <TextInput
                    label="Start Date"
                    value={date ? date.toDateString() : ''}
                    onFocus={() => setShowStartPicker(true)}
                    style={styles.input}
                    underlineColor="transparent"
                    showSoftInputOnFocus={false}
                />
                {showStartPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartPicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}

                <Pressable onPress={() => setShowStatusDropdown(!showStatusDropdown)} style={styles.input}>
                    <Text style={styles.dropdownText}>{status || 'Select Status'}</Text>
                </Pressable>
                {showStatusDropdown && (
                    <View style={styles.dropdown}>
                        {['active', 'in_active'].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setStatus(item);
                                    setShowStatusDropdown(false);
                                }}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

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
    container: {
        padding: 24,
        backgroundColor: '#F9F9F9',
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
      loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        padding: 12,
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
        borderRadius: 6,
        marginBottom: 10,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
    saveBtn: {
        backgroundColor: '#75AB38',
    },
    saveText: {
        color: '#fff',
        fontWeight: '500',
    },
});
