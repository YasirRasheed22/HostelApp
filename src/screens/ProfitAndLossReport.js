import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import RNFS from 'react-native-fs';
import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { font } from '../components/ThemeStyle';
import axios from 'axios';
import { ApiUrl } from '../../config/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDisplayDate = (reportDate) => {
  if (!reportDate) return '';
  const firstDate = reportDate.split('|')[0];
  const date = new Date(firstDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ReportCard = ({ user, onView, onDelete }) => (
  <View style={styles.card2} key={user.id}>
    <View style={styles.infoBox}>
      <Text style={styles.name}>{user.reportType}</Text>
      <Text>Date: {formatDisplayDate(user?.reportDate)}</Text>
      <Text>Created By: {user?.user?.fullName}</Text>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => onView(user)} style={styles.viewBtn}>
        <Text style={styles.btnText}>
          <FontAwesome name='download' />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(user.id)} style={styles.deleteBtn}>
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProfitAndLossReport() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [reportList, setReportList] = useState([]);
 
  useEffect(() => {
  

    fetchReports();
  }, [isFocused]);

    const fetchReports = async () => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const res = await axios.put(`${ApiUrl}/api/report`, { db_name: db });
        const reports = res.data?.data || [];

        setReportList(reports.filter(r => r.reportType === 'Profit and Loss Report'));
       
        
      } catch (error) {
        console.log('Fetch Error:', error.message);
      }
    };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version >= 33) return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const downloadFile = async (fileUrl) => {
    // const hasPermission = await requestStoragePermission();
    // if (!hasPermission) {
    //   Alert.alert('Permission Denied', 'Cannot download file without permission');
    //   return;
    // }

    // const fileName = fileUrl.split('/').pop();
    // const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    // try {
    //   const result = await RNFS.downloadFile({
    //     fromUrl: fileUrl,
    //     toFile: downloadPath,
    //   }).promise;

    //   if (result.statusCode === 200) {
    //     Alert.alert('Success', `File downloaded to: Downloads folder`);
    //   } else {
    //     Alert.alert('Error', 'Download failed');
    //   }
    // } catch (err) {
    //   console.error('Download Error:', err.message);
    //   Alert.alert('Error', 'Something went wrong while downloading');
    // }
    Linking.openURL(fileUrl)
  };

  const handleView = (report) => {
    if (report?.fileUrl) {
      downloadFile(report.fileUrl);
    } else {
      Alert.alert('Error', 'File URL is missing');
    }
  };

 const handleDelete = id => {
    console.log('Delete:', id);
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
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/report/${id}`, {
                data: {db_name: db},
              });
              console.log('Report deleted successfully');
              fetchReports();
            } catch (error) {
              console.error('Error deleting Report:', error.message);
              Alert.alert('Error', 'Failed to delete the Report.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
       
        <View style={styles.container2}>
          {/* <Text style={styles.sectionTitle}>Generated Reports</Text> */}
          <FlatList
            scrollEnabled={false}
            data={reportList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReportCard user={item} onView={handleView} onDelete={handleDelete} />
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: font.secondary,
    color: '#4E4E5F',
    marginBottom: 10,
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: '30%',
    alignItems: 'center',
  },
  textWrapper: {
    width: '70%',
  },
  cardTitle: {
    fontSize: 13,
    color: '#7CB33D',
    fontFamily: font.secondary,
  },
  cardCount: {
    fontSize: 13,
    fontFamily: font.secondary,
    color: '#7CB33D',
    marginTop: 4,
  },
  icons: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#75AB38',
    borderRadius: 10,
  },
  card2: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  infoBox: {
    width: '80%',
  },
  name: {
    fontSize: 18,
    fontFamily: font.secondary,
    marginBottom: 6,
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
  btnText: {
    color: 'white',
    fontFamily: font.secondary,
  },
  container2: {
    marginTop: 20,
  },
});
