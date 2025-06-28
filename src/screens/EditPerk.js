import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Provider, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import { useRoute } from '@react-navigation/native';

export default function EditPerk() {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [perkType, setPerkType] = useState('');

    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const route = useRoute();
    const {id} = route.params;
    console.log(id)

    useEffect(() => {
    const fetchPerk = async () => {
        const db = await AsyncStorage.getItem('db_name');
        try {
            const response = await axios.put(`${ApiUrl}/api/fees/perks/single/${id}`, { db_name: db });
            console.log(response.data);

            const data = response.data?.perk;

            setTitle(data?.title || '');
            setPerkType(data?.perk_type || '');
            setStatus(data?.status || '');
            setPrice(data?.price?.toString() || ''); 
            setDate(new Date(data?.affectedDate));   

        } catch (error) {
            console.log(error.message);
        }
    };
    fetchPerk();
}, []);



    const handleSubmit = async () => {
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
            const response = await axios.post(`${ApiUrl}/api/fees/perks/single/${id}`, payload);
            console.log(response.data);
            Alert.alert('Success', 'Perk Updated successfully');
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
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
