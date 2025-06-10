import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';

const ReportCard = ({user, onView, onDelete}) => (
  <View style={styles.card2} key={user.id}>
    <View style={styles.infoBox}>
      <Text style={styles.name}>{user.name}</Text>
      <Text>Date: {user.Date}</Text>
      <Text>Created By: {user.CreatedBy}</Text>
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

export default function Reports() {
  const navigation = useNavigation()
  const handleView = user => {
    console.log('View:', user);
  };

  const handleDelete = id => {
    console.log('Delete:', id);
  };

  const reports = [
    {label: 'Assets Reports', count: 1, icon: 'file-text-o' , comp:'AssetReport' },
    {label: 'Active Tenants Reports', count: 2, icon: 'file-text-o' , comp:'ActiveTenantReport' },
    {label: 'Inactive Tenants Reports', count: 10, icon: 'file-text-o' , comp:'InActiveTenantReport'},
    {label: 'Profit and Loss Report', count: 3, icon: 'file-text-o' , comp:'ProfitAndLossReport'},
  ];

  const reportList = [
    {
      id: 1,
      name: 'Attendence Report',
      Date: '30 Jan 2025',
      CreatedBy: 'Staff Update',
    },
    {
      id: 2,
      name: 'Attendence Report',
      Date: '30 Jan 2025',
      CreatedBy: 'Staff Update',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Reports</Text>
          <TouchableOpacity>
            <AntDesign name="addfile" size={28} color="#4E4E5F" />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />
        <View style={styles.cardList}>
          {reports.map((item, index) => (
            <TouchableOpacity onPress={()=>navigation.navigate(item.comp)} key={index} style={styles.card}>
              <View style={styles.iconWrapper}>
                <View style={styles.icons}>
                  <FontAwesome name={item.icon} size={15} color="#fff" />
                </View>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardCount}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.container2}>
          <Text style={styles.sectionTitle}>List</Text>
          <FlatList
            data={reportList}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ReportCard
                user={item}
                onView={handleView}
                onDelete={handleDelete}
              />
            )}
          />
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
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: font.secondary,
  },
  subtitle: {
    fontSize: 25,
    marginTop: 10,
    color: '#4E4E5F',
    // fontWeight: 'bold',
     fontFamily: font.secondary,
  },
  subheading: {
    fontSize: 18,
    marginTop: 5,
    color: '#4E4E5F',
    // fontWeight: 'bold',
     fontFamily: font.secondary,
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
    marginTop: 10,
    marginBottom: 10,
    color: '#4E4E5F',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardList: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '48%',
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
    fontSize: 13,
    fontFamily: font.secondary,
    // fontWeight: '600',
  },
  cardCount: {
    color: '#7CB33D',
    fontSize: 13,
    // fontWeight: 'bold',
     fontFamily: font.secondary,
    marginTop: 4,
  },
  icons: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#75AB38',
  },
  topContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
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
  },
  btnText: {
    color: 'white',
    // fontWeight: 'bold',
     fontFamily: font.secondary,
  },
  card2: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  container2: {
    marginTop: 20,
  },
});
