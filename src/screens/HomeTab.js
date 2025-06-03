import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

export default function HomeTab() {
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
    {label: 'In', count: 12 , comp: 'Attendance'},
    {label: 'Out', count: 4 , comp:'Attendance'},
  ];


  const vacantRooms = [
    {
      floorName: '1',
      RoomName: 'B-86',
      capacity: '4',
      Tenants: '4',
      status: 'Active',
    },
  ];
  const FilledRooms = [
    {
      floorName: '2',
      RoomName: 'A-47',
      capacity: '2',
      Tenants: '1',
      status: 'Active',
    },
  ];
  const Rooms = [
     {
      floorName: '1',
      RoomName: 'A-47',
      capacity: '2',
      Tenants: '1',
      status: 'Active',
    },
    {
      floorName: '2',
      RoomName: 'B-86',
      capacity: '4',
      Tenants: '4',
      status: 'Active',
    },
  ];

  const ReceivedAmount = [
  { image : '' , name: 'Adam' , phone: '123456789' , rent:'230' , paymentDate: '23 Jan 2024' , status:'Active'},
];
  const ReceivableAmount = [
  { image : '' , name: 'Harry' , phone: '1434456789' , rent:'230' , paymentDate: '23 Jan 2024' , status:'InActive'},
];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity>
            <Entypo name="menu" size={28} color="#4E4E5F" />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />
        <View style={styles.topContainer}>
          <Text style={styles.subtitle}>Good Evening 🌇</Text>
          <Text style={styles.subheading}>Welcome! Staff Update</Text>
        </View>

        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.cardList}>
          {stats.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                if (item.label === 'Rooms') {
                  navigation.navigate('Rooms', { data: Rooms });
                } else if (item.label === 'Vacant Rooms') {
                  navigation.navigate('Rooms', { data: vacantRooms });
                } else if (item.label === 'Filled Rooms') {
                  navigation.navigate('Rooms', { data: FilledRooms });
                } else if (item.label === 'Received Amount') {
                  navigation.navigate('Payments', { data: ReceivedAmount });
                }  else if (item.label === 'Receivable Amount') {
                  navigation.navigate('Payments', { data: ReceivableAmount });
                } else if (item.comp) {
                  navigation.navigate(item.comp);
                }
              }}
              >
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
        </View>

        <Text style={styles.sectionTitle}>Attendance</Text>
        <View style={styles.cardList}>
          {attendance.map((item, index) => (
            <TouchableOpacity onPress={()=>navigation.navigate(item.comp)} key={index} style={styles.card}>
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
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 25,
    marginTop: 10,
    color: '#4E4E5F',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    marginTop: 5,
    color: '#4E4E5F',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    width: '80%',
  },
  cardTitle: {
    color: '#7CB33D',
    fontSize: 16,
    fontWeight: '600',
  },
  cardCount: {
    color: '#7CB33D',
    fontSize: 20,
    fontWeight: 'bold',
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
});
