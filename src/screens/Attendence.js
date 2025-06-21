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
import { font } from '../components/ThemeStyle';
import { useNavigation } from '@react-navigation/native';

export default function Attendence() {
  const navigation = useNavigation();

  const handlePress = () =>{
    navigation.navigate('GenerateAttendence')
  }
  const handleSubmit = (item) => {
    console.log(item)
    navigation.navigate('AttendenceList' , {data:item?.data});
  }

   navigation.setOptions({
      headerTitle: 'Attendence',
       headerTitleStyle:{fontSize: 15,fontFamily:font.secondary},
       headerRight:()=>{
               return(
                <TouchableOpacity onPress={handlePress}>
            <AntDesign name="addfile" size={28} color="#4E4E5F" />
               </TouchableOpacity>
               );
       }
    })
  const reports = [
    {label: 'Total', count: 1, icon: 'file-text-o' , data:'all'},
    {label: 'In', count: 2, icon: 'file-text-o' , data:'in'},
    {label: 'Out', count: 10, icon: 'file-text-o' , data:'out'},
    {label: 'Leave', count: 3, icon: 'file-text-o', data:'leave'},
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.titleRow}>
          <Text style={styles.title}>Attendence</Text>
          <TouchableOpacity>
            <AntDesign name="addfile" size={28} color="#4E4E5F" />
          </TouchableOpacity>
        </View> */}
        {/* <View style={styles.separator}/> */}
        <View style={styles.cardList}>
          {reports.map((item, index) => (
            <TouchableOpacity onPress={() => handleSubmit(item)} key={index} style={styles.card}>
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
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
  },
  subtitle: {
    fontSize: 25,
    marginTop: 10,
    color: '#4E4E5F',
    // fontWeight: 'bold',
    fontFamily:font.secondary,
  },
  subheading: {
    fontSize: 18,
    marginTop: 5,
    color: '#4E4E5F',
    // fontWeight: 'bold',
    fontFamily:font.secondary
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
    fontFamily:font.secondary,
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
    fontFamily:font.secondary,
    // fontWeight: '600',
  },
  cardCount: {
    color: '#7CB33D',
    fontSize: 13,
    // fontWeight: 'bold',
    fontFamily:font.secondary,
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
    fontFamily:font.secondary,
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
    fontFamily:font.secondary,
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
