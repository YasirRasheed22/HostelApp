import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {BarChart} from 'react-native-chart-kit';
import {font} from '../components/ThemeStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';

export default function HomeTab() {
  const [greeting, setGreeting] = useState('');

  const [rooms, setRooms] = useState([]);
  const [filledRooms, setFilledRooms] = useState([]);
  const [vacantRooms, setVacantRooms] = useState([]);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) return 'Good Morning 🌇';
      if (hour >= 12 && hour < 15) return 'Good Noon ☀️';
      if (hour >= 15 && hour < 18) return 'Good Afternoon 🌤️';
      if (hour >= 18 && hour < 21) return 'Good Evening 🌇';
      return 'Good Night 🌙';
    };

    setGreeting(getGreeting());
    getFilledRooms();
    getAllRooms();
    getVacantRooms();
  }, []);

  const navigation = useNavigation();
  const stats = [
    {
      label: 'Active Tenants',
      count: 1,
      icon: 'file-text-o',
      comp: 'ActiveMember',
    },
    {
      label: 'Inactive Tenants',
      count: 2,
      icon: 'check-square-o',
      comp: 'InactiveMember',
    },
    {label: 'Rooms', count: 10, icon: 'exchange', comp: 'Rooms'},
    {label: 'Staff Members', count: 3, icon: 'exchange', comp: 'StaffMember'},
    {label: 'Received Amount', count: 50000, icon: 'exchange'},
    {label: 'Receivable Amount', count: 15000, icon: 'exchange'},
    {label: 'Vacant Rooms', count: 5, icon: 'exchange'},
    {label: 'Filled Rooms', count: 7, icon: 'exchange'},
  ];

  const attendance = [
    {label: 'In', count: 12, comp: 'Attendance'},
    {label: 'Out', count: 4, comp: 'Attendance'},
  ];

  const vacantRoom = vacantRooms;
  const FilledRooms = filledRooms;
  const Rooms = rooms;

  const ReceivedAmount = [
    {
      image: '',
      name: 'Adam',
      phone: '123456789',
      rent: '230',
      paymentDate: '23 Jan 2024',
      status: 'Active',
    },
  ];
  const ReceivableAmount = [
    {
      image: '',
      name: 'Harry',
      phone: '1434456789',
      rent: '230',
      paymentDate: '23 Jan 2024',
      status: 'InActive',
    },
  ];

  const WeeklyExpenses = {
    labels: ['week1', 'week2', 'week3', 'week4'],
    datasets: [
      {
        data: [20, 45, 28, 80],
      },
    ],
  };
  const WeeklyFees = {
    labels: ['week1', 'week2', 'week3', 'week4'],
    datasets: [
      {
        data: [1.2, 1.4, 1.8, 3.3],
      },
    ],
  };

  const getAllRooms = async () => {
    try {
      const db_name = await AsyncStorage.getItem('db_name');
      const payload = {db_name};

      const response = await axios.put(
        `${ApiUrl}/api/rooms`,
        payload,
      );
      console.log(payload)
      const mappedRooms = response.data.map(room => ({
        floorName: room.floor_name,
        RoomName: room.name,
        capacity: room.capacity,
        Tenants: room.tenantCount,
        status: room.tenantCount >= room.capacity ? 'Occupied' : 'Available',
      }));

      setRooms(mappedRooms);
    } catch (error) {
      console.log('Failed to fetch all rooms:', error);
    }
  };

  const getFilledRooms = async () => {
    try {
      const db_name = await AsyncStorage.getItem('db_name');
      const payload = {db_name};

      const response = await axios.put(
        `${ApiUrl}/api/rooms/filled-room`,
        payload,
      );
      console.log('filled............room', response.data);

      const mappedRooms = response.data.map(room => ({
        floorName: room.floor_name,
        RoomName: room.name,
        capacity: room.capacity,
        Tenants: room.tenantCount,
        status: room.tenantCount >= room.capacity ? 'Occupied' : 'Available',
      }));

      setFilledRooms(mappedRooms);
    } catch (error) {
      console.log('Failed to fetch filled rooms:', error);
    }
  };

  const getVacantRooms = async () => {
    try {
      const db_name = await AsyncStorage.getItem('db_name');
      const payload = {db_name};

      const response = await axios.put(
        `${ApiUrl}/api/rooms/vacant-room`,
        payload,
      );

      const mappedRooms = response.data.map(room => ({
        floorName: room.floor_name,
        RoomName: room.name,
        capacity: room.capacity,
        Tenants: room.tenantCount,
        status: room.tenantCount >= room.capacity ? 'Occupied' : 'Available',
      }));

      setVacantRooms(mappedRooms);
    } catch (error) {
      console.log('Failed to fetch vacant rooms:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity
          // onPress={navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Entypo name="menu" size={28} color="#4E4E5F" />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />
        <View style={styles.topContainer}>
          <Text style={styles.subtitle}>{greeting}</Text>
          <Text style={styles.subheading}>Welcome! Staff Update</Text>
        </View>

        <Text style={styles.sectionTitle}>Stats</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {stats.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, styles.horizontalCard]}
              onPress={() => {
                if (item.label === 'Rooms') {
                  navigation.navigate('Rooms', {data: Rooms});
                } else if (item.label === 'Vacant Rooms') {
                  navigation.navigate('Rooms', {data: vacantRoom});
                } else if (item.label === 'Filled Rooms') {
                  navigation.navigate('Rooms', {data: FilledRooms});
                } else if (item.label === 'Received Amount') {
                  navigation.navigate('Payments', {data: ReceivedAmount});
                } else if (item.label === 'Receivable Amount') {
                  navigation.navigate('Payments', {data: ReceivableAmount});
                } else if (item.comp) {
                  navigation.navigate(item.comp);
                }
              }}>
              <View style={styles.iconWrapper}>
                <View style={styles.icons}>
                  <FontAwesome name={item.icon} size={20} color="#fff" />
                </View>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardCount}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Attendance</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {attendance.map((item, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item.comp)}
              key={index}
              style={[styles.card, styles.horizontalCard]}>
              <View style={styles.iconWrapper}>
                <View style={styles.icons}>
                  <Entypo name="cycle" size={26} color="#fff" />
                </View>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardCount}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Charts</Text>
        <Text style={{textAlign: 'center', marginTop: '20'}}>
          Weekly Expenses
        </Text>
        <ScrollView horizontal>
          <BarChart
            style={styles.chart}
            data={WeeklyExpenses}
            width={Dimensions.get('window').width - 70}
            height={300}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0, // optional: round y-axis values
              color: () => `#75AB38`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // axis labels in black
              barPercentage: 0.5,
              strokeWidth: 2,
              useShadowColorFromDataset: false,
            }}
            verticalLabelRotation={30}
            fromZero={true}
            showBarTops={false}
          />
        </ScrollView>

        <Text style={{textAlign: 'center', marginTop: '30'}}>Weekly Fees</Text>
        <ScrollView horizontal>
          <BarChart
            style={styles.chart}
            data={WeeklyFees}
            width={Dimensions.get('window').width - 70}
            height={300}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0, // optional: round y-axis values
              color: () => `#75AB38`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // axis labels in black
              barPercentage: 0.5,
              strokeWidth: 2,
              useShadowColorFromDataset: false,
            }}
            verticalLabelRotation={30}
            fromZero={true}
            showBarTops={false}
          />
        </ScrollView>
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
  title: {
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
  },
  subtitle: {
    fontSize: 25,
    fontFamily: font.secondary,
    marginTop: 10,
    color: '#4E4E5F',
  },
  subheading: {
    fontSize: 18,
    fontFamily: font.primary,
    marginTop: 5,
    color: '#4E4E5F',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
    marginTop: 20,
    color: '#4E4E5F',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  // New Card Styles
  cardList: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    fontSize: 16,
    fontFamily: font.secondary,
    // fontWeight: '600',
  },
  cardCount: {
    color: '#7CB33D',
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: font.primary,
    marginTop: 4,
  },
  icons: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    backgroundColor: '#75AB38',
  },
  topContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  horizontalScroll: {
    marginTop: 10,
  },
  horizontalCard: {
    width: 200,
    marginRight: 12,
  },
  chart: {
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
  },
});
