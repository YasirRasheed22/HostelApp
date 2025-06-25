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
import React, { useEffect, useRef, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import { Animated, Easing } from 'react-native';
import { SideDrawer } from '../navigation/SideDrawer';



export default function HomeTab() {
  const [greeting, setGreeting] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-250)).current; // drawer width

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
    { label: 'Rooms', count: 10, icon: 'exchange', comp: 'Rooms' },
    { label: 'Staff Members', count: 3, icon: 'exchange', comp: 'StaffMember' },
    { label: 'Received Amount', count: 50000, icon: 'exchange' },
    { label: 'Receivable Amount', count: 15000, icon: 'exchange' },
    { label: 'Vacant Rooms', count: 5, icon: 'exchange' },
    { label: 'Filled Rooms', count: 7, icon: 'exchange' },
  ];

  const attendance = [
    { label: 'In', count: 12, comp: 'Attendance' },
    { label: 'Out', count: 4, comp: 'Attendance' },
  ];

 

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

 
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -250,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.in(Easing.ease),
    }).start(() => setDrawerOpen(false));
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, position: 'relative' }}>
        <SideDrawer
          drawerAnim={drawerAnim}
          drawerOpen={drawerOpen}
          closeDrawer={closeDrawer}
          navigation={navigation}
        />
        {/* Drawer and Overlay go here
        {drawerOpen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeDrawer}
          />
        )}

        <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
          <View style={styles.row}>
          <Text style={styles.drawerTitle}>Menu</Text>
           <Entypo name="cross" size={28} color="#4E4E5F" onPress={closeDrawer} />
          </View>

          <TouchableOpacity style={styles.drawerItem} onPress={() => {
            closeDrawer();
            navigation.navigate('Assets');
          }}>
            <Text style={styles.drawerText}>Assets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem} onPress={() => {
            closeDrawer();
            navigation.navigate('Expenses');
          }}>
            <Text style={styles.drawerText}>Expenses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem} onPress={() => {
            closeDrawer();
            navigation.navigate('StaffMember');
          }}>
            <Text style={styles.drawerText}>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => {
            closeDrawer();
            navigation.navigate('Rooms', { data: 'AllRoom' });
          }}>
            <Text style={styles.drawerText}>Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => {
            closeDrawer();
            navigation.navigate('Attendance');
          }}>
            <Text style={styles.drawerText}>Attendence</Text>
          </TouchableOpacity>
        </Animated.View> */}
        <ScrollView contentContainerStyle={styles.container}>

          <View style={styles.titleRow}>
            <Text style={styles.title}>Dashboard</Text>
            <TouchableOpacity
            // onPress={navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Entypo name="menu" size={28} color="#4E4E5F" onPress={openDrawer} />
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
                    navigation.navigate('Rooms', { data: 'AllRoom' });
                  } else if (item.label === 'Vacant Rooms') {
                    navigation.navigate('Rooms', { data: 'VacantRoom' });
                  } else if (item.label === 'Filled Rooms') {
                    navigation.navigate('Rooms', { data: 'FilledRoom' });
                  } else if (item.label === 'Received Amount') {
                    navigation.navigate('Payments', { data: ReceivedAmount });
                  } else if (item.label === 'Receivable Amount') {
                    navigation.navigate('Payments', { data: ReceivableAmount });
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
          <Text style={{ textAlign: 'center', marginTop: '20' }}>
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

          <Text style={{ textAlign: 'center', marginTop: '30' }}>Weekly Fees</Text>
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
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
    zIndex: 100,
    elevation: 5,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },

  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  drawerItem: {
    paddingVertical: 15,
  },

  drawerText: {
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

});
