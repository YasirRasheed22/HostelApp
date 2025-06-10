// ActiveTenants.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import Orientation from 'react-native-orientation-locker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';

const TenantCard = ({ user, onView, onDelete }) => (
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
      <TouchableOpacity onPress={() => onDelete(user.id)} style={styles.deleteBtn}>
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ActiveTenants() {
  const navigation = useNavigation();
   navigation.setOptions({
      headerTitle: 'Active Tenants',
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

  const [isTableView, setIsTableView] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const tenants = [
    {
      id: '1',
      name: 'Henry',
      gender: 'female',
      phone: '+92 300 1234567',
      room: '1200',
      rent: '5000',
      salary: '10000',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Thomas',
      phone: '+92 300 7654321',
      room: '1300',
      rent: '5500',
      salary: '11000',
      role: 'user',
    },
  ];

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

  const handleView = user => console.log('View:', user);
  const handleDelete = id => console.log('Delete:', id);

  useEffect(() => {
    return () => Orientation.unlockAllOrientations();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <View style={styles.titleRow}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name='arrow-back' size={24}/>
          </TouchableOpacity>
          <Text style={styles.title}>Active Tenants</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={toggleView} style={styles.topIcon}>
              <AntDesign name="retweet" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddTenant')} style={styles.topIcon}>
              <AntDesign name="adduser" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View> */}
        {/* <View style={styles.separator} /> */}

        {isTableView ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Phone</DataTable.Title>
              <DataTable.Title>Rent</DataTable.Title>
              <DataTable.Title>Room</DataTable.Title>
              <DataTable.Title>Role</DataTable.Title>
            </DataTable.Header>
            {tenants
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
            data={tenants}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    padding: 24,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },
  title: {
    fontSize: 22,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  topIcon: {
    marginLeft: 10,
    backgroundColor: '#75AB38',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
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
  },
  sideBox: {
    width: '30%',
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
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
});
