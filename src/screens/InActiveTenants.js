import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';

const TenantCard = ({user, onView, onDelete}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.sideBox}>
        <Text>👤</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{user.name}</Text>
        <Text>Phone: {user.phone}</Text>
        <Text>Salary: {user.salary}</Text>
        <Text>Role: {user.role}</Text>
      </View>
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

export default function InActiveTenants() {
  const InactiveTenants = [
    {
      id: '1',
      image: '',
      name: 'Henry',
      gender: 'female',
      phone: '+92 300 1234567',
      room: '1200',
      rent: 'admin',
    },
    {
      id: '2',
      name: 'Thomas',
      phone: '+92 300 7654321',
      salary: '10000',
      role: 'admin',
    },
  ];

  const handleView = user => {
    console.log('View:', user);
  };

  const handleDelete = id => {
    console.log('Delete:', id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>InActive Tenants</Text>
          <TouchableOpacity style={styles.topIcon}>
            <AntDesign name="adduser" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={InactiveTenants}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TenantCard
              user={item}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 20,
  },
  container: {
    padding: 24,
    // backgroundColor: '#f2f2f2',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sideBox: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    marginTop: 6,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  inactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  topIcon: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#75AB38',
    borderRadius: 10,
  },
});
