import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { font } from '../components/ThemeStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import { useRoute } from '@react-navigation/native';

export default function EditAsset() {

    const [values, setValues] = useState({
        title: '',
        sellPrice: '',
        quantity: '',
        descritpion: ''
    });

    const route = useRoute();
    const { id } = route.params;

    console.log(id)

    useEffect(() => {
        const fetchAsset = async () => {
            const db = await AsyncStorage.getItem('db_name');
            try {
                const payload = {
                    db_name: db,
                };

                const response = await axios.put(`${ApiUrl}/api/inventory/single/${id}`, payload);
                const asset = response.data;

                setValues({
                    title: asset.title || '',
                    sellPrice: asset.sellPrice?.toString() || '',
                    quantity: asset.quantity?.toString() || '',
                    descritpion: asset.description || ''
                });
            } catch (error) {
                console.log('Error fetching asset:', error.message);
            }
        };

        fetchAsset();
    }, []);

    const handleSave = async () => {
        // console.error(values)
        try {
            const db = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name: db,
                costPrice: '',
                description: values.descritpion,
                quantity: values.quantity,
                sellPrice: values.sellPrice,
                title: values.title,
            }
            console.log(payload)
            const response = await axios.put(`${ApiUrl}/api/inventory/update/${id}`, payload);
            Alert.alert('Inventary Updated Successfully')
            console.log(response);
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.sectionTitle}>Asset Information</Text>

            <View style={styles.row}>
                <TextInput
                    placeholder="ASSET TITLE"
                    value={values?.title}
                    onChangeText={(text) => {
                        setValues({
                            ...values,
                            title: text
                        })
                    }}
                    style={styles.input}
                />
                <TextInput
                    placeholder="ASSET PRICE"
                    value={values.sellPrice}
                    onChangeText={(text) => {
                        setValues({
                            ...values,
                            price: text
                        })
                    }}
                    style={styles.input}
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    placeholder="QUANTITY"
                    value={values.quantity}
                    onChangeText={(text) => {
                        setValues({
                            ...values,
                            qty: text
                        })
                    }}
                    style={styles.input}
                />


                <TextInput
                    placeholder="DESCRIPTION"
                    multiline
                    numberOfLines={4} // Optional: Helps give initial height
                    value={values.descritpion}
                    onChangeText={(text) => {
                        setValues({
                            ...values,
                            descritpion: text
                        });
                    }}
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                />

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
        // flexDirection: 'row',
        // gap: 10,
        // marginBottom: 12,
    },
    input: {
        // flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        paddingLeft: 10,
        // width: '160',
        marginBottom: 10,
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
