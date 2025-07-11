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
  ActivityIndicator,
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
        <Text style={styles.btnText}>
          <AntDesign name='delete' />
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Reports() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [reportList, setReportList] = useState([]);
    const [loading , setLoading] = useState(true)

  const [assetReport, setAssetReport] = useState([]);
  const [profitReport, setProfitReport] = useState([]);
  const [inactiveTenant, setInactiveTenant] = useState([]);
  const [activeTenant, setActiveTenant] = useState([]);

  useEffect(() => {
  

    fetchReports();
  }, [isFocused]);

    const fetchReports = async () => {
      const db = await AsyncStorage.getItem('db_name');
      try {
        const res = await axios.put(`${ApiUrl}/api/report`, { db_name: db });
        const reports = res.data?.data || [];

        setReportList(reports);
        setAssetReport(reports.filter(r => r.reportType === 'Assets Report'));
        setProfitReport(reports.filter(r => r.reportType === 'Profit and Loss Report'));
        setInactiveTenant(reports.filter(r => r.reportType === 'InActive Tenants Report'));
        setActiveTenant(reports.filter(r => r.reportType === 'Active Tenants Report'));
      } catch (error) {
        console.log('Fetch Error:', error.message);
      }finally{
        setLoading(false)
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
              setLoading(true)
              const db = await AsyncStorage.getItem('db_name');
              await axios.delete(`${ApiUrl}/api/report/${id}`, {
                data: {db_name: db},
              });
              console.log('Report deleted successfully');
              fetchReports();
            } catch (error) {
              console.error('Error deleting Report:', error.message);
              Alert.alert('Error', 'Failed to delete the Report.');
            }finally{
              setLoading(false)
            }
          },
        },
      ],
      {cancelable: true},
    );
  };


  const handleAddReport = () => {
    navigation.navigate('ReportGen');
  };

  const summaryCards = [
    { label: 'Assets Reports', count: assetReport?.length, icon: 'file-text-o', comp: 'AssetReport' },
    { label: 'Active Tenants Reports', count: activeTenant?.length, icon: 'file-text-o', comp: 'ActiveTenantReport' },
    { label: 'Inactive Tenants Reports', count: inactiveTenant?.length, icon: 'file-text-o', comp: 'InActiveTenantReport' },
    { label: 'Profit and Loss Report', count: profitReport?.length, icon: 'file-text-o', comp: 'ProfitAndLossReport' },
  ];
  
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#75AB38" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Reports</Text>
          <TouchableOpacity onPress={handleAddReport}>
            <AntDesign name="addfile" size={28} color="#4E4E5F" />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <View style={styles.cardList}>
          {summaryCards.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate(item.comp)} style={styles.card}>
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
          <Text style={styles.sectionTitle}>Generated Reports</Text>
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
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: font.secondary,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: font.secondary,
    color: '#4E4E5F',
    marginBottom: 12,
  },

  // Summary Cards
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#75AB38',
    marginRight: 12,
  },
  icons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#7CB33D',
    fontFamily: font.secondary,
  },
  cardCount: {
    fontSize: 13,
    fontFamily: font.secondary,
    color: '#7CB33D',
    marginTop: 4,
  },

  // Report List Card
  container2: {
    marginTop: 20,
  },
  card2: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoBox: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 17,
    fontFamily: font.secondary,
    color: '#333',
    marginBottom: 6,
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  viewBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    fontFamily: font.secondary,
    fontSize: 14,
  },
});
