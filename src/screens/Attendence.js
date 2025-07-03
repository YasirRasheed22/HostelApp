import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors, font } from '../components/ThemeStyle';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import { Button } from 'react-native-paper';
import AlertModal from '../components/CustomAlert';

export default function Attendence() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [counter, setCount] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('danger');

  useEffect(() => {
    const fetchRecord = async () => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const payload = {
          db_name: db
        }

        const response = await axios.put(`${ApiUrl}/api/attendance/dashboard`, payload);
        console.log(response.data);
        setCount(response.data);
      } catch (error) {
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    }

    fetchRecord();
  }, [])

  const handlePress = () => {
    navigation.navigate('GenerateAttendence')
  }

  const handleSync = async() =>{
    setLoading(true)
    const db = await AsyncStorage.getItem('db_name');
    const payload={
      db_name: db
    }
    try {
      const response = await axios.put(`${ApiUrl}/api/attendance/` , payload);
      console.log(response);
      setLoading(false);
      setModalType('success');
      setModalMessage('Attendence Sync Successfully');
      setModalVisible(true);
    } catch (error) {
      console.log(error.message)
      setModalType('danger');
      setModalMessage('Something went wrong');
      setModalVisible(true);
    }finally{
      setLoading(false);
    }
  }
  const handleSubmit = (item) => {
    console.log(item)
    if (item.data === 'leave') {
      navigation.navigate('LeaveList', { data: 'all' });
    } else {
      navigation.navigate('AttendenceList', { data: item?.data });
    }

  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Attendence',
      headerTitleStyle: { fontSize: 15, fontFamily: font.secondary },
      headerRight: () => {
        return (<>
          <View style={{display:'flex', flexDirection:'row' , gap :10 , alignItems:'center'}}>
            <TouchableOpacity onPress={handlePress}>
              <AntDesign name="addfile" size={28} color="#4E4E5F" />
            </TouchableOpacity>
            {/* <Button style={styles.button} labelStyle={{color:'#fff' }}>Sync</Button>  */}
            <TouchableOpacity onPress={handleSync} style={styles.button}>
              <AntDesign name='sync' color='#fff' size={15} />
            </TouchableOpacity>
          </View>

        </>
        );
      }
    })
  }, [navigation])

  const reports = [
    { label: 'Total', count: counter?.totalCount || 0, icon: 'file-text-o', data: 'all' },
    { label: 'In', count: counter?.presentCount || 0, icon: 'file-text-o', data: 'in' },
    { label: 'Out', count: counter?.absentCount || 0, icon: 'file-text-o', data: 'out' },
    { label: 'Leave', count: counter?.leaveCount || 0, icon: 'file-text-o', data: 'leave' },
  ];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AlertModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          message={modalMessage}
          type={modalType}
        />
        <View style={styles.cardList}>
          {reports.map((item, index) => (
            <TouchableOpacity onPress={() => handleSubmit(item)} key={index} style={styles.card}>
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
      </ScrollView>
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
  cardList: {
    marginTop: 10,
    display: 'flex',
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
  button: {
    padding: 6,
    height: 40,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#75AB38',
    borderRadius: 10,
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
});
