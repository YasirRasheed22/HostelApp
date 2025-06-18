import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useLayoutEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { DataTable } from 'react-native-paper';
import { font } from '../components/ThemeStyle';

const TenantCard = ({user, onView, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image
         source={{ uri: 'https://www.w3schools.com/w3images/avatar6.png' }}
         style={styles.avatar}
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user.name}</Text>
        <Text>Phone: {user.phone}</Text>
        <Text>Salary: {user.salary}</Text>
        <Text>Role: {user.role}</Text>
      </View>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => onView(user)} style={styles.viewBtn}>
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(user.id)}
        style={styles.deleteBtn}>
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function InActiveTenants() {

  const navigation = useNavigation();
  console.log(navigation)
  useLayoutEffect(()=>{
    navigation.setOptions({
    headerTitle: 'In Active Tenants',
     headerTitleStyle:{fontSize: 15,fontFamily:font.secondary},
     headerRight:()=>{
             return(
               <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={toggleView} style={styles.topIcon}>
                  <AntDesign name="retweet" size={22} color="#fff" />
                </TouchableOpacity>
              <TouchableOpacity onPress={()=>navigation.navigate('AddTenant')} style={styles.topIcon}>
                <AntDesign name="adduser" size={22} color="#fff" />
              </TouchableOpacity>
              </View>
             );
     }
  })

  },[navigation])
  
    const [isTableView, setIsTableView] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 5;

  const InactiveTenants = [
    {
      id: '1',
      image: '',
      name: 'Henry',
      gender: 'female',
      phone: '+92 300 1234567',
      room: '1200',
      rent: 'admin',
    },
    {
      id: '2',
      name: 'Thomas',
      phone: '+92 300 7654321',
      salary: '10000',
      role: 'admin',
    },
  ];
  

  const handleView = user => {
    console.log('View:', user);
  };

  const handleDelete = id => {
    console.log('Delete:', id);
  };

   const toggleView = () => {
    setIsTableView(prev => {
      if (!prev) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      return !prev;
    });
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
       
        <View style={styles.separator} />
        {isTableView ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title>
              <DataTable.Title>Rent</DataTable.Title>
              <DataTable.Title>Room</DataTable.Title>
              <DataTable.Title>Role</DataTable.Title>
            </DataTable.Header>
            {InactiveTenants
              .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
              .map(item => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.phone}</DataTable.Cell>
                  <DataTable.Cell>{item.rent}</DataTable.Cell>
                  <DataTable.Cell>{item.room}</DataTable.Cell>
                  <DataTable.Cell>{item.role}</DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        ) : (
          <FlatList
            data={InactiveTenants}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TenantCard user={item} onView={handleView} onDelete={handleDelete} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    // marginBottom: 10,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
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
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    width: '70%',
  },
  name: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
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
  },
  btnText: {
    color: 'white',
    // fontWeight: 'bold',
    fontFamily:font.secondary,
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
    fontFamily:font.secondary,
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
