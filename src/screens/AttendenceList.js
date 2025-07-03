import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ApiUrl } from '../../config/services'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';



const formatDate = (dateStr) => {
  if (!dateStr) return '';

  try {
    // Replace all non-standard spaces (like U+202F) with normal spaces
    const cleanedStr = dateStr.replace(/\s+/g, ' ').trim(); // normalize spaces

    // Split into date and time parts
    const [datePart, timePart] = cleanedStr.split(' at ');
    if (!datePart || !timePart) return '';

    const [monthName, dayWithComma, year] = datePart.split(' ');
    const day = dayWithComma.replace(',', ''); // remove comma if any
    const [time, period] = timePart.split(' ');

    const months = {
      January: 'Jan',
      February: 'Feb',
      March: 'Mar',
      April: 'Apr',
      May: 'May',
      June: 'Jun',
      July: 'Jul',
      August: 'Aug',
      September: 'Sep',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
    };

    const shortMonth = months[monthName];
    if (!shortMonth) return '';

    return `${day} ${shortMonth}, ${time} ${period}`;
  } catch (e) {
    console.error('Date formatting failed:', e);
    return '';
  }
};


const UserCard = ({user,onView}) => (
  <TouchableWithoutFeedback onPress={() => onView(user)}>
  <View style={styles.card}>
    <View style={styles.row}>
     <View style={styles.sideBox}>
             <Image
               source={{uri: user?.tenant?.profile_image}}
               style={[styles.avatar, {objectFit: 'cover'}]}
             />
           </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user?.tenant?.name}</Text>
        <Text>Last Record Time: {formatDate(user?.log_time_record)}</Text>
        <Text>Room Info: {user?.tenant?.room?.name} | {user?.tenant?.room?.floor_name}</Text>
        <Text>Status: {user?.status}</Text>
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => onView(user)} style={styles.viewBtn}>
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => onEdit(user)} style={styles.EditBtn}>
        <Text style={styles.btnText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(user.id)}
        style={styles.deleteBtn}>
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity> */}
    </View>
  </View>
  </TouchableWithoutFeedback>
);
export default function AttendenceList() {

  const navigation = useNavigation();
  const [users , setUser] = useState([]);
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const {data} = route.params;
  console.log(data);

  let url = `${ApiUrl}/api/attendance/dashboard`

  if(data === 'in')
  {
    url = `${ApiUrl}/api/attendance/status/in`
  }else if (data === 'out')
  {
    url = `${ApiUrl}/api/attendance/status/out`
  }
  // else{
  //   url = `${ApiUrl}/api/attendance/dashboard`
  // }
    
useLayoutEffect(()=>{
       navigation.setOptions({
      headerTitle: 'Attendence',
      headerTitleStyle: {fontSize: 15, fontFamily: font.secondary},
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row'}}>
            {/* <TouchableOpacity  style={styles.topIcon}>
              <AntDesign name="retweet" size={22} color="#fff" />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('MarkAttendence')}
              style={[styles.topIcon, {marginRight: 12}]}>
              <AntDesign name="adduser" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      },
    });
    },[navigation])
    const isFocused = useIsFocused();
    useEffect(()=>{
     const fetchAttendence = async() => {
        try {
            const db  = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name:db
            }

            const response = await axios.put(url, payload);
            console.log(response.data?.attendance);
            setUser(response.data?.attendance);
        } catch (error) {
            console.log(error.message)
        }finally{
          setLoading(false);
        }
     };
     fetchAttendence();
    },[isFocused])

    const handleEdit=(user)=>{
        console.log(user);
    }
    const handleDelete=(user)=>{
        console.log(user);
    }
    const handleView=(user)=>{
        console.log(user);
        navigation.navigate('AttendenceView' ,{id: user.tenant_id})
    }

      if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }
  return (
   <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* {isTableView ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Title</DataTable.Title>
              <DataTable.Title>Sell Price</DataTable.Title>
              <DataTable.Title>Quantity</DataTable.Title>
            </DataTable.Header>
            {users
              .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
              .map(item => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.title}</DataTable.Cell>
                  <DataTable.Cell>{item.sellPrice}</DataTable.Cell>
                  <DataTable.Cell>{item.quantity}</DataTable.Cell>
                 
                </DataTable.Row>
              ))}
          </DataTable>
        ) : ( */}
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <UserCard
                user={item}
                onView={handleView}
                // onDelete={handleDelete}
                // onEdit={handleEdit}
              />
            )}
          />
        {/* )} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    padding: 24,
    // backgroundColor: '#f2f2f2',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
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
    width: '100%',
  },
  name: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  viewBtn: {
    backgroundColor: '#75AC38',
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
    // fontWeight: 'bold',
    fontFamily: font.secondary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    marginTop: 6,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  inactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  topIcon: {
    marginLeft: 10,
    backgroundColor: '#75AB38',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
});
