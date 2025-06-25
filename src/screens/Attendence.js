import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { font } from '../components/ThemeStyle';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';

export default function Attendence() {
  const navigation = useNavigation();
  const [counter , setCount] = useState();

  useEffect(()=>{
    const fetchRecord = async() => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const payload = {
                db_name:db
            }

         const response = await axios.put( `${ApiUrl}/api/attendance/dashboard` , payload);
         console.log(response.data);
         setCount(response.data);
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchRecord();
  },[])

  const handlePress = () =>{
    navigation.navigate('GenerateAttendence')
  }
  const handleSubmit = (item) => {
    console.log(item)
    navigation.navigate('AttendenceList' , {data:item?.data});
  }

   navigation.setOptions({
      headerTitle: 'Attendence',
       headerTitleStyle:{fontSize: 15,fontFamily:font.secondary},
       headerRight:()=>{
               return(
                <TouchableOpacity onPress={handlePress}>
            <AntDesign name="addfile" size={28} color="#4E4E5F" />
               </TouchableOpacity>
               );
       }
    })
  const reports = [
    {label: 'Total', count: counter?.totalCount, icon: 'file-text-o' , data:'all'},
    {label: 'In', count: counter?.presentCount, icon: 'file-text-o' , data:'in'},
    {label: 'Out', count: counter?.absentCount, icon: 'file-text-o' , data:'out'},
    {label: 'Leave', count:counter?.leaveCount, icon: 'file-text-o', data:'leave'},
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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
