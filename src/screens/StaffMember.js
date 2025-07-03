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
  RefreshControl,
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
    </View>
  </TouchableWithoutFeedback>
);

export default function StaffMember() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [staffmembers, setStaffMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

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
  }, [navigation]);

  const fetchStaff = async () => {
    try {
      const db = await AsyncStorage.getItem('db_name');
      const payload = { db_name: db };
     
      const response = await axios.put(`${ApiUrl}/api/users`, payload);
      const mappedStaff = response.data?.data.map(staff => ({
        id: staff.id,
        name: staff.fullName,
        phone: staff.phone,
        salary: staff.salary,
        role: staff.role,
        image: staff.profile_image
      }));
      setStaffMembers(mappedStaff);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', 'Failed to load staff members');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStaff();
  };

  const handleView = (user) => {
    navigation.navigate('StaffView', {id: user?.id});
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
              setLoading(true);
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/users/${id}`, {
                data: {db_name: db},
              });
              console.log('Staff deleted successfully');
              fetchStaff();
            } catch (error) {
              console.error(error.message);
              Alert.alert('Error', 'Failed to delete Member.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleEdit = (id) => {
    navigation.navigate('EditStaff', {id: id.id});
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#75AB38']} // Android
              tintColor="#75AB38" // iOS
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No staff members found</Text>
            </View>
          }
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
    paddingHorizontal: 12,
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
    marginHorizontal: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sideBox: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: font.secondary,
  },
});