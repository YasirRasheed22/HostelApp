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
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {font} from '../components/ThemeStyle';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StaffCard = ({user, onView, onEdit, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image
          source={{uri: 'https://www.w3schools.com/w3images/avatar6.png'}}
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

export default function StaffMember() {
  const navigation = useNavigation();
  const [staffmembers, setStaffMembers] = useState([]);

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: 'Staff Members',
    headerTitleStyle: { fontSize: 15, fontFamily: font.secondary },
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('AddStaff')}
        style={styles.topIcon}>
        <AntDesign name="adduser" size={22} color="#fff" />
      </TouchableOpacity>
    ),
  });
}, [navigation]); // ✅ Correct use of dependency array

  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchStaff = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
      };
      console.log(payload);
      try {
        const response = await axios.put(`${ApiUrl}/api/users`, payload);
        console.log(response);
        const mappedStaff = response.data.users.map(staff => ({
          id: staff.id,
          name: staff.fullName,
          phone: staff.phone,
          salary: staff.salary,
          role: staff.role,
        }));
        setStaffMembers(mappedStaff);

        setStaffMembers(mappedStaff);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchStaff();
  }, [isFocused]);
  

  const handleView = (user) => {
    console.log('View:', user);
    navigation.navigate('StaffView' , {id: user.id});
  };

  const handleDelete = id => {
    console.log('Delete:', id);
  };
  const handleEdit = (id) => {
    console.log('Edit:', id);
    navigation.navigate('EditStaff', {id:id.id})
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <View style={styles.titleRow}>
          <Text style={styles.title}>Staff Members</Text>
          
        </View> */}
        {/* <View style={styles.separator} /> */}
        <FlatList
          data={staffmembers}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <StaffCard
              user={item}
              onView={handleView}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        />
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
    EditBtn: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight:10,
  },
  inactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  topIcon: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#75AB38',
    borderRadius: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
});
