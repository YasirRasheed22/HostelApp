import { View, Text, SafeAreaView, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { font } from '../components/ThemeStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import { useRoute } from '@react-navigation/native';


const formatDate = (dateStr) => {
  if (!dateStr) return '';

  try {
    const cleanedStr = dateStr.replace(/\s+/g, ' ').trim();

    const [datePart, timePart] = cleanedStr.split(' at ');
    if (!datePart || !timePart) return '';

    const [monthName, dayWithComma, year] = datePart.split(' ');
    const day = dayWithComma.replace(',', ''); 
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




const UserCard = ({user}) => (
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
   
  </View>
);



export default function AttendenceView() {

    const [users , setUser] = useState();
    const route = useRoute();
    const {id} = route.params;
    const [loading, setLoading] = useState(true);
    console.log(id);


   
    useEffect(()=>{
        const fetchUser = async() => {
            const db = await AsyncStorage.getItem('db_name');
            const payload = {
                db_name :db
            }
            try {
                const response = await axios.put(`${ApiUrl}/api/attendance/fetch-attendance-history/${id}` , payload)
                console.log(response.data);
                setUser(response?.data?.attendance)
            } catch (error) {
                console.log(error.message);
            }finally{
              setLoading(false);
            }
        }
        fetchUser();
    },[])
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
                //    onView={handleView}
                //    onDelete={handleDelete}
                //    onEdit={handleEdit}
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
       loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
       width: '80%',
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
     avatar: {
       width: 60,
       height: 60,
       borderRadius: 30,
       backgroundColor: '#ccc',
     },
   });
   