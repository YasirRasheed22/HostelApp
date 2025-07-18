import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    FlatList,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';

const UserCard = ({ user, onEdit, onView, onDelete }) => (
    <View style={styles.card1}>
        <View style={styles.row}>
            <View style={styles.sideBox}>
                <Image
                    source={{ uri: user?.tenants?.profile_image }}
                    style={[styles.avatar, { objectFit: 'cover' }]}
                />
            </View>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{user?.tenants?.name}</Text>
                <Text>Phone: {user?.tenants?.phone}</Text>
                <Text>Amount: {user?.amount}</Text>
                <Text>Status: {user?.status}</Text>
                <Text>Payment Status: {user?.payment_received_status}</Text>
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => onView(user)} style={styles.viewBtn}>
                <Text style={styles.btnText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEdit(user)} style={styles.EditBtn}>
                <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onDelete(user.id)}
                style={styles.deleteBtn}>
                <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function FeeList() {
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentYear = String(today.getFullYear());
    const navigation = useNavigation();
    const [counter, setCounter] = useState();
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [startDate, setStartDate] = useState(currentMonth);
    const [showEndDropdown, setShowEndDropdown] = useState(false);
    const [endDate, setEndDate] = useState(currentYear);
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchFee = async () => {
        const db = await AsyncStorage.getItem('db_name');
        try {
            const payload = {
                db_name: db,
            }
            const response = await axios.put(`${ApiUrl}/api/fees/${startDate}/${endDate}`, payload);
            setUser(response.data?.data || []);
            setCounter(response.data);
        } catch (error) {
            console.log(error.message);
            Alert.alert('Error', 'Failed to fetch fees data');
        }finally{
            setLoading(false)
        }
    }

    const isFocussed = useIsFocused();
    useEffect(() => {
        fetchFee();
    }, [isFocussed, startDate, endDate]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Fee List',
            headerTitleStyle: { fontSize: 15, fontFamily: font.secondary },
            headerRight: () => (
                <TouchableOpacity onPress={handlePress}>
                    <AntDesign name="addfile" size={28} color="#4E4E5F" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const reports = [
        { label: 'Active Fees', count: counter?.activePayment || 0, icon: 'file-text-o' },
        { label: 'Received Fees (Verified)', count: counter?.receivedPaymentverified || 0, icon: 'file-text-o' },
        { label: 'Received Fees (Unverified)', count: counter?.receivedPaymentUnverified || 0, icon: 'file-text-o' },
        { label: 'Remaining Fees', count: 0, icon: 'file-text-o' },
    ];

    const handlePress = () => {
        navigation.navigate('GenerateFee');
    };

    const handleEdit = (user) => {
        navigation.navigate('EditFee', {id: user.id});
    }

    const handleDelete = async(id) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const db = await AsyncStorage.getItem('db_name');
                            await axios.delete(`${ApiUrl}/api/fees/single/${id}`, {
                                data: {db_name: db},
                            });
                            fetchFee();
                        } catch (error) {
                            console.error(error.message);
                            Alert.alert('Error', 'Failed to delete Fees.');
                        }
                    },
                },
            ],
            {cancelable: true},
        );
    };
      if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

    const handleView = (user) => {
        navigation.navigate('FeeView', {id: user.id});
    }

    const handleFilter = () => {
        fetchFee();
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                ListHeaderComponent={
                    <View style={styles.container}>
                        {/* Date Selectors */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable 
                                onPress={() => {
                                    setShowStartDropdown(!showStartDropdown);
                                    setShowEndDropdown(false);
                                }} 
                                style={styles.input}
                            >
                                <Text style={styles.dropdownText}>{startDate || 'Select Month'}</Text>
                            </Pressable>
                            
                            {showStartDropdown && (
                                <View style={[styles.dropdown, {left: 0, right: '52%'}]}>
                                    <ScrollView>
                                        {[
                                            { name: 'Jan', value: '01' },
                                            { name: 'Feb', value: '02' },
                                            { name: 'Mar', value: '03' },
                                            { name: 'Apr', value: '04' },
                                            { name: 'May', value: '05' },
                                            { name: 'Jun', value: '06' },
                                            { name: 'Jul', value: '07' },
                                            { name: 'Aug', value: '08' },
                                            { name: 'Sep', value: '09' },
                                            { name: 'Oct', value: '10' },
                                            { name: 'Nov', value: '11' },
                                            { name: 'Dec', value: '12' }
                                        ].map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setStartDate(item.value);
                                                    setShowStartDropdown(false);
                                                }}
                                            >
                                                <Text>{item.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                            
                            <Pressable 
                                onPress={() => {
                                    setShowEndDropdown(!showEndDropdown);
                                    setShowStartDropdown(false);
                                }} 
                                style={styles.input}
                            >
                                <Text style={styles.dropdownText}>{endDate || 'Select Year'}</Text>
                            </Pressable>
                            
                            {showEndDropdown && (
                                <View style={[styles.dropdown, {left: '52%', right: 0}]}>
                                    <ScrollView>
                                        {Array.from({length: 21}, (_, i) => 2015 + i).map((year) => (
                                            <TouchableOpacity
                                                key={year}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setEndDate(String(year));
                                                    setShowEndDropdown(false);
                                                }}
                                            >
                                                <Text>{year}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                        
                        <TouchableOpacity onPress={handleFilter} style={styles.button}>
                            <Text style={{ color: '#fff' }}>Filter</Text>
                        </TouchableOpacity>
                        
                        {/* Stats Cards */}
                        <View style={styles.cardList}>
                            {reports.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.card}>
                                    <View style={styles.iconWrapper}>
                                        <View style={styles.icons}>
                                            <FontAwesome name={item.icon} size={15} color="#fff" />
                                        </View>
                                    </View>
                                    <View style={styles.textWrapper}>
                                        <Text style={styles.cardTitle}>{item.label}</Text>
                                        <Text style={styles.cardCount}>{item.count}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                }
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <UserCard
                        user={item}
                        onView={handleView}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                )}
                contentContainerStyle={styles.listContentContainer}
                ListFooterComponent={<View style={{ height: 20 }} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
       loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
    container: {
        padding: 24,
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    cardList: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '48%',
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    iconWrapper: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWrapper: {
        width: '70%',
    },
    cardTitle: {
        color: '#7CB33D',
        fontSize: 13,
        fontFamily: font.secondary,
    },
    cardCount: {
        color: '#7CB33D',
        fontSize: 13,
        fontFamily: font.secondary,
        marginTop: 4,
    },
    icons: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#75AB38',
    },
    input: {
        padding: 12,
        width: '48%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        zIndex: 999,
        elevation: 5,
        padding: 10,
        maxHeight: 300
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
        padding: 10,
        marginTop: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    card1: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        elevation: 3,
        marginHorizontal: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    sideBox: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBox: {
        width: '75%',
    },
    name: {
        fontSize: 18,
        fontFamily: font.secondary,
        marginBottom: 6,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end',
    },
    viewBtn: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    deleteBtn: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    EditBtn: {
        backgroundColor: 'gray',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    btnText: {
        color: 'white',
        fontFamily: font.secondary,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
    },
});