import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Alert,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';

export default function ReportGen() {
    const navigation = useNavigation();

    const [showReportDropdown, setShowReportDropdown] = useState(false);
    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

    const [payAcc, setPayAcc] = useState([]);
    const [reportType, setReportType] = useState();
    const [payments, setPayment] = useState();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
        const fetchPayment = async () => {
            const db = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name: db
            }
            try {
                const response = await axios.put(`${ApiUrl}/api/payment`, payload)
                console.log(response.data?.payments);
                setPayAcc(response.data?.payments);
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchPayment();
    }, [])

    const formatDate = (date) => {
  if (!date) return '';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
};

const handleSubmit = async () => {
    console.log('Submit pressed');

    if (!reportType) {
        Alert.alert('Missing', 'Please select a report type');
        return;
    }

    if (reportType === 'Payment Report' && !payments?.id) {
        Alert.alert('Missing', 'Please select a payment account');
        return;
    }

    const db = await AsyncStorage.getItem('db_name');
    const user = await AsyncStorage.getItem('user');
    const json = JSON.parse(user)


    const payload = {
        db_name: db,
        startDate:startDate?.toISOString(), // Safe access
        endDate: endDate?.toISOString(),
        reportType: reportType,
        payment_bank_id: payments?.id || null, // safe fallback
        user_id:json.id
    };

    console.log('Payload:', payload);

    try {
        console.log('API running');
        const response = await axios.post(`${ApiUrl}/api/report/generate`, payload);
        console.log(response.data);
        Alert.alert('Report Generated');
    } catch (error) {
        console.log('API error:', error.message);
        Alert.alert('Error', 'Failed to generate report.');
    }
};


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Generate Report',
            headerTitleStyle: { fontSize: 15, fontFamily: font.secondary },
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    {/* Report Type Dropdown */}
                    <Pressable
                        style={[styles.input, { width: '100%' }]}
                        onPress={() => setShowReportDropdown(!showReportDropdown)}
                    >
                        <Text style={styles.dropdownText}>
                            {reportType || 'Select Report Type'}
                        </Text>
                    </Pressable>

                    {showReportDropdown && (
                        <View style={styles.dropdown}>
                            <ScrollView>
                                {[
                                    { name: 'Assets Report', value: '01' },
                                    { name: 'Active Tenants Report', value: '02' },
                                    { name: 'InActive Tenants Report', value: '03' },
                                    { name: 'Profit and Loss Report', value: '04' },
                                    { name: 'Staff Report', value: '05' },
                                    { name: 'Payment Report', value: '06' },
                                    { name: 'Expense Report', value: '07' }
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setReportType(item.name);
                                            setShowReportDropdown(false);
                                        }}
                                    >
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Payment Account Dropdown */}
                    {reportType === 'Payment Report' && (
                        <>
                            <Pressable
                                style={[styles.input, { width: '100%' }]}
                                onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
                            >
                                <Text style={styles.dropdownText}>
                                    {payments?.bank_name || 'Select Payment Account'}
                                </Text>
                            </Pressable>

                            {showPaymentDropdown && (
                                <View style={styles.dropdown}>
                                    <ScrollView>
                                        {payAcc.map((item, index) => (

                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setPayment(item);
                                                        setShowPaymentDropdown(false);
                                                    }}
                                                >
                                                    <Text>{item?.bank_name || item?.type}- {item?.account_number}</Text>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        </>
                    )}

                </View>

                {/* Start Date Picker */}
                <Text style={styles.dropdownText}>Start date</Text>
                <Pressable onPress={() => setShowStartPicker(true)} style={styles.input}>
                    <Text style={styles.dropdownText}>{formatDate(startDate)}</Text>
                </Pressable>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartPicker(false);
                            if (selectedDate) setStartDate(selectedDate);
                        }}
                    />
                )}

                {/* End Date Picker */}
                <Text style={styles.dropdownText}>End date</Text>
                <Pressable onPress={() => setShowEndPicker(true)} style={styles.input}>
                    <Text style={styles.dropdownText}>{formatDate(endDate)}</Text>
                </Pressable>
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndPicker(false);
                            if (selectedDate) setEndDate(selectedDate);
                        }}
                    />
                )}

                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={{ color: '#fff' }}>Generate Report</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    container: {
        padding: 24,
    },
    input: {
        padding: 12,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        zIndex: 999,
        elevation: 5,
        padding: 10,
        maxHeight: 300,
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
    button: {
        backgroundColor: '#75AB38',
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
});
