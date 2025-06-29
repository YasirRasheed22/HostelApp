import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUrl } from '../../config/services';
import { SideDrawer } from '../navigation/SideDrawer';

export default function HomeTab() {
  const [greeting, setGreeting] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-250)).current;

  const [counter, setCounter] = useState();
  const [counter1, setCounter1] = useState();
  const [allowedTabs, setAllowedTabs] = useState([]);
  const [WeeklyExpenses, setWeeklyExpenses] = useState({ labels: [], datasets: [] });
  const [WeeklyFees, setWeeklyFee] = useState({ labels: [], datasets: [] });

  const navigation = useNavigation();

  const isFocussed = useIsFocused()
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return 'Good Morning 🌇';
      if (hour >= 12 && hour < 15) return 'Good Noon ☀️';
      if (hour >= 15 && hour < 18) return 'Good Afternoon 🌤️';
      if (hour >= 18 && hour < 21) return 'Good Evening 🌇';
      return 'Good Night 🌙';
    };

    const fetchRecord = async () => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const response = await axios.put(`${ApiUrl}/api/attendance/dashboard`, { db_name: db });
        setCounter1(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const getCounts = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const response = await axios.put(`${ApiUrl}/api/users/dashboard`, { db_name: db });
        console.log(response)
        setCounter(response.data?.array);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchGraphExpense = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const response = await axios.put(`${ApiUrl}/api/report/dashboard/expense/graph`, { db_name: db });
        setWeeklyExpenses({
          labels: response.data?.data?.weeks,
          datasets: [{ data: response.data?.data?.expenses }],
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchprevileges = async() => {
       try {
        const data = await AsyncStorage.getItem('privileges');
        if (data) {
          const parsed = JSON.parse(data);
          setAllowedTabs(parsed);
        } else {
          setAllowedTabs(null); // Show all if not found
        }
      } catch (error) {
        console.error('Failed to load privileges:', error);
        setAllowedTabs(null); // Fail-safe: show all
      }
    }

    const fetchGraphFees = async () => {
      try {
        const db = await AsyncStorage.getItem('db_name');
        const response = await axios.put(`${ApiUrl}/api/report/dashboard/fees/graph`, { db_name: db });
        setWeeklyFee({
          labels: response.data?.data?.weeks,
          datasets: [{ data: response.data?.data?.payments }],
        });
      } catch (error) {
        console.log(error);
      }
    };

    setGreeting(getGreeting());
    getCounts();
    fetchRecord();
    fetchGraphExpense();
    fetchGraphFees();
    fetchprevileges();
  }, [isFocussed]);

  const stats = [
    { label: 'Active Tenants',  key: 'tenants', count: counter?.activeTenants, icon: 'file-text-o', comp: 'ActiveMember' },
    { label: 'Inactive Tenants', key: 'tenants', count: counter?.tenants - counter?.activeTenants, icon: 'check-square-o', comp: 'InactiveMember' },
    { label: 'Rooms',  key: 'rooms',count: counter?.rooms, icon: 'exchange', comp: 'Rooms' },
    { label: 'Staff Members', key:'staff', count: counter?.user, icon: 'exchange', comp: 'StaffMember' },
    { label: 'Receivable Amount',key:'accounts', count: counter?.receivedAmount, icon: 'exchange' },
    { label: 'Received Amount' ,key:'accounts', count: counter?.receiveableAmount, icon: 'exchange' },
    { label: 'Vacant Rooms', key: 'rooms', count: counter?.vacantRooms, icon: 'exchange' },
    { label: 'Filled Rooms', key: 'rooms', count: counter?.filledRooms, icon: 'exchange' },
  ];

  const filteredStats = stats.filter((item) => {
  if (!allowedTabs) return true;           // If no restriction, show all
  if (!item.key) return true;              // If item has no key, always show
  return allowedTabs[item.key];            // Check privilege
});


  const attendance = [
    { label: 'In', count: counter1?.presentCount, comp: 'Attendance' },
    { label: 'Out', count: counter1?.absentCount, comp: 'Attendance' },
  ];

  const ReceivedAmount = [
    { image: '', name: 'Adam', phone: '123456789', rent: '230', paymentDate: '23 Jan 2024', status: 'Active' },
  ];
  const ReceivableAmount = [
    { image: '', name: 'Harry', phone: '1434456789', rent: '230', paymentDate: '23 Jan 2024', status: 'InActive' },
  ];

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
        <SideDrawer drawerAnim={drawerAnim} drawerOpen={drawerOpen} closeDrawer={closeDrawer} navigation={navigation} />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Dashboard</Text>
            <TouchableOpacity>
              <Entypo name="menu" size={28} color="#4E4E5F" onPress={openDrawer} />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />
          <View style={styles.topContainer}>
            <Text style={styles.subtitle}>{greeting}</Text>
            <Text style={styles.subheading}>Welcome! Staff Update</Text>
          </View>

          <Text style={styles.sectionTitle}>Stats</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {filteredStats.map((item, index) => (
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

         {(!allowedTabs || allowedTabs.attendance) && (
  <>
    <Text style={styles.sectionTitle}>Attendance</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
      {attendance.map((item, index) => (
        <TouchableOpacity key={index} style={[styles.card, styles.horizontalCard]} onPress={() => navigation.navigate(item.comp)}>
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
  </>
)}

     {(!allowedTabs || allowedTabs.accounts) && (
  <>
          {WeeklyExpenses.datasets.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Charts</Text>
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Weekly Expenses</Text>
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
                    decimalPlaces: 0,
                    color: () => `#75AB38`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.5,
                    strokeWidth: 2,
                    useShadowColorFromDataset: false,
                  }}
                  verticalLabelRotation={30}
                  fromZero
                  showBarTops={false}
                />
              </ScrollView>
            </>
          )}
         

          {WeeklyFees.datasets.length > 0 && (
            <>
              <Text style={{ textAlign: 'center', marginTop: 30 }}>Weekly Fees</Text>
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
                    decimalPlaces: 0,
                    color: () => `#75AB38`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.5,
                    strokeWidth: 2,
                    useShadowColorFromDataset: false,
                  }}
                  verticalLabelRotation={30}
                  fromZero
                  showBarTops={false}
                />
              </ScrollView>
            </>
          )}
           </>)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  container: { padding: 24 },
  title: { fontSize: 25, fontFamily: font.secondary },
  subtitle: { fontSize: 25, fontFamily: font.secondary, marginTop: 10, color: '#4E4E5F' },
  subheading: { fontSize: 18, fontFamily: font.primary, marginTop: 5, color: '#4E4E5F' },
  separator: { height: 1, backgroundColor: '#ccc', marginTop: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontFamily: font.secondary, marginTop: 20, color: '#4E4E5F' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 16, marginBottom: 12, alignItems: 'center' },
  iconWrapper: { width: '30%', justifyContent: 'center', alignItems: 'center' },
  textWrapper: { width: '70%' },
  cardTitle: { color: '#7CB33D', fontSize: 16, fontFamily: font.secondary },
  cardCount: { color: '#7CB33D', fontSize: 18, fontFamily: font.primary, marginTop: 4 },
  icons: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#75AB38' },
  topContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  horizontalScroll: { marginTop: 10 },
  horizontalCard: { width: 200, marginRight: 12 },
  chart: { padding: 10, backgroundColor: '#fff', marginTop: 10, borderRadius: 10 },
});
