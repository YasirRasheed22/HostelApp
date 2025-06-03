import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Attendence() {
  const reports = [
    {label: 'Total', count: 1, icon: 'file-text-o'},
    {label: 'In', count: 2, icon: 'file-text-o'},
    {label: 'Out', count: 10, icon: 'file-text-o'},
    {label: 'Leave', count: 3, icon: 'file-text-o'},
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Attendence</Text>
          <TouchableOpacity>
            <AntDesign name="addfile" size={28} color="#4E4E5F" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator}/>
        <View style={styles.cardList}>
          {reports.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card}>
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
    fontWeight: '600',
  },
  cardCount: {
    color: '#7CB33D',
    fontSize: 13,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
