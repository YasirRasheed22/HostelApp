import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AlertModal from '../components/CustomAlert';

export default function GenerateFee() {

    const navigation = useNavigation();
    const [showStartDropdown, setShowStartDropdown] = useState();
    const [startDate, setStartDate] = useState()
        const [loading, setLoading] = useState(false);
        const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger'); 

    const [showEndDropdown, setShowEndDropdown] = useState();
    const [endDate, setEndDate] = useState()

    useEffect(()=>{
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // "01" to "12"
        const currentYear = String(today.getFullYear());
        setStartDate(currentMonth);
        setEndDate(currentYear);
    },[])


    const handleSubmit = async() => {
                    setLoading(true)

        const db = await AsyncStorage.getItem('db_name');
        const payload = {
            db_name: db,
            month: startDate,
            year: endDate
       }
        try {
            const response = await axios.post(`${ApiUrl}/api/fees` , payload);
            console.log(response);
            setModalType('success');
        setModalMessage('Report Generated');
        setModalVisible(true);
        } catch (error) {

           if(error.status === 400)
           {
                setModalType('danger');
        setModalMessage('No Danger');
        setModalVisible(true);
           }else{
              setModalType('danger');
        setModalMessage('Validation Error');
        setModalVisible(true);
           }
        }finally{
                        setLoading(false)

        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Fee List',
            headerTitleStyle: { fontSize: 15, fontFamily: font.secondary },
            // headerRight: () => (
            //     <TouchableOpacity onPress={handlePress}>
            //         <AntDesign name="addfile" size={28} color="#4E4E5F" />
            //     </TouchableOpacity>
            // ),
        });
    }, [navigation]);
    const today = new Date();
    const handlePress = () => {
        navigation.navigate('GenerateFee');
    };
    
      if (loading) {
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#75AB38" />
          </View>
        );
      }
    return (
        <SafeAreaView style={styles.safeArea}>
             <AlertModal
  visible={modalVisible}
  onDismiss={() => setModalVisible(false)}
  message={modalMessage}
  type={modalType}
/>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ display: 'flex' , marginTop:25, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => setShowStartDropdown(!showStartDropdown) && setShowEndDropdown(false)} style={styles.input}>
                        <Text style={styles.dropdownText}>{startDate || 'Select Month'}</Text>
                    </Pressable>
                    {showStartDropdown && (
                        <View style={styles.dropdown}>
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
                                            setStartDate(item.value); // Set the value like '01'
                                            setShowStartDropdown(false);
                                        }}
                                    >
                                        <Text>{item.name}</Text> {/* Show 'Jan', 'Feb', etc. */}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                        </View>
                    )}
                    <Pressable onPress={() => setShowEndDropdown(!showEndDropdown) && setShowStartDropdown(false)} style={styles.input}>
                        <Text style={styles.dropdownText}>{endDate || 'Select Year'}</Text>
                    </Pressable>
                    {showEndDropdown && (
                        <View style={styles.dropdown}>
                            <ScrollView>
                                {['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setEndDate(item);
                                            setShowEndDropdown(false);
                                        }}
                                    >
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                </View>
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
    cardList: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
      loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
    container2: {
        marginTop: 20,
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
        left: 0,
        right: 0,
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
        marginTop:20,
        padding: 10,
        // width:'30%',
        alignItems: 'center',
        borderRadius: 10,
    },
});
