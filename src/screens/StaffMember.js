import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {font} from '../components/ThemeStyle';
import axios from 'axios';
import {ApiUrl} from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StaffCard = ({user, onView, onEdit, onDelete}) => (
   <TouchableWithoutFeedback onPress={() => onView(user)}>
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Image
          source={{uri: user?.image}}
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
    {/* <View style={styles.buttonContainer}>
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
    </View> */}
  </View>
  </TouchableWithoutFeedback>
);

export default function StaffMember() {
  const navigation = useNavigation();
    const [loading , setLoading] = useState(true)

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
    fetchStaff();
  }, [isFocused]);

     const fetchStaff = async () => {
      const db = await AsyncStorage.getItem('db_name');
      const payload = {
        db_name: db,
      };
     
      try {
        const response = await axios.put(`${ApiUrl}/api/users`, payload);
        console.log(response);
        const mappedStaff = response.data?.data.map(staff => ({
          id: staff.id,
          name: staff.fullName,
          phone: staff.phone,
          salary: staff.salary,
          role: staff.role,
          image: staff.profile_image
        }));
        setStaffMembers(mappedStaff);

        setStaffMembers(mappedStaff);
      } catch (error) {
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    };

  

  const handleView = (user) => {
    console.log('View:', user);
    navigation.navigate('StaffView' , {id: user?.id});
  };

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
              setLoading(true)
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/users/${id}`, {
                data: {db_name: db},
              });
              console.log('Staff deleted successfully');
              fetchStaff();
              // Optional: refresh list or show success toast
            } catch (error) {
              console.error( error.message);
              Alert.alert('Error', 'Failed to delete Member.');
            }finally{
              setLoading(false)
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  const handleEdit = (id) => {
    console.log('Edit:', id);
    navigation.navigate('EditStaff', {id:id.id})
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
 container: {
  flex: 1,
  paddingVertical: 20,
  paddingHorizontal: 12, // reduced padding for better layout with shadow
  backgroundColor: '#F9F9F9',
},

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  marginHorizontal: 8, // Add horizontal margin to prevent cut-off shadows
  elevation: 5, // For Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
},  sideBox: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBox: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: font.secondary,
    color: '#333',
    marginBottom: 6,
  },
  status: {
    marginTop: 10,
    fontFamily: font.secondary,
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
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
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
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
  EditBtn: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  btnText: {
    color: 'white',
    fontFamily: font.secondary,
  },
});

