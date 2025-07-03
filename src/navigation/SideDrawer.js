import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SideDrawer = ({ drawerAnim, drawerOpen, closeDrawer, navigation }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [allowedPages, setAllowedPages] = useState(null);
  const [image , setImage] = useState()
  const [name , setName] = useState()

  useEffect(() => {
    const fetching = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(user); // Parse the whole string first
    console.log(parsedUser?.profile_image); // See the actual URL
    setImage(parsedUser?.profile_image);
    setName(parsedUser?.fullName)
  } catch (err) {
    console.error('Error fetching image:', err);
  }
};

    const fetchPrivileges = async () => {
      try {
        const data = await AsyncStorage.getItem('privileges');
        setAllowedPages(data ? JSON.parse(data) : null);
      } catch (error) {
        console.error('Failed to load privileges:', error);
        setAllowedPages(null);
      }
    };
    fetchPrivileges();
    fetching()
  }, []);

  const toggleMenu = (label) => {
    setOpenMenu(prev => (prev === label ? null : label));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      Alert.alert('Logout Error', err.message);
    }
  };

  const menus = [
    { label: 'Dashboard' },
    {
      label: 'Tenants',
      key: 'tenants',
      subpages: [
        { label: 'Add New', route: 'AddTenant' },
        { label: 'List', route: 'Tenants' },
      ],
    },
    {
      label: 'Staff',
      key: 'staff',
      subpages: [
        { label: 'Add New', route: 'AddStaff' },
        { label: 'List', route: 'StaffMember' },
      ],
    },
    {
      label: 'Rooms',
      key: 'rooms',
      subpages: [
        { label: 'List', route: 'Rooms', params: { data: 'All Rooms' } },
        { label: 'Add New', route: 'AddRoom' },
      ],
    },
    {
      label: 'Assets',
      key: 'assets',
      subpages: [
        { label: 'Add New', route: 'AddAsset' },
        { label: 'List', route: 'Assets' },
      ],
    },
    {
      label: 'Attendance',
      key: 'attendance',
      subpages: [
        { label: 'List', route: 'Attendance' },
        { label: 'Mark Attendance', route: 'GenerateAttendence' },
        { label: 'Leaves', route: 'LeavePage' },
      ],
    },
    {
      label: 'Fee / Billing',
      key: 'fee',
      subpages: [
        { label: 'List', route: 'FeeList' },
        { label: 'Perks', route: 'PerkList' },
      ],
    },
    {
      label: 'Account',
      key: 'accounts',
      subpages: [{ label: 'Expenses', route: 'Expenses' }],
    },
    {
      label: 'Organization',
      key: 'organization',
      subpages: [
        { label: 'Organization', route: 'OrganizationProfile' },
        { label: 'Payments', route: 'payments' },
      ],
    },
    {
      label: 'Announcements',
      key: 'staff',
      subpages: [{ label: 'Announcements', route: 'Announcements' }],
    },
    {
      label: 'Reports',
      key: 'reports',
      subpages: [{ label: 'List', route: 'Reports' }],
    },
  ];

  const shouldShowMenu = (menu) => {
    if (!allowedPages) return true;
    if (!menu.key) return true;
    return allowedPages[menu.key];
  };

  return (
    <>
      {drawerOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />
      )}

      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={()=>{navigation.navigate('Profile') ; closeDrawer();}} >
            <Image source={{ uri: image }} style={styles.roundImage} />
              </TouchableOpacity>
              <Text style={styles.drawerTitle}>{name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <Entypo name="cross" size={28} color="#4E4E5F" onPress={closeDrawer} />
          </View>

          {menus.filter(shouldShowMenu).map((menu) => (
            <View key={menu.label}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => toggleMenu(menu.label)}
              >
                <Text style={styles.drawerText}>{menu.label}</Text>
                {menu.subpages && (
                  <Entypo
                    name={openMenu === menu.label ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#333"
                  />
                )}
              </TouchableOpacity>

              {openMenu === menu.label && menu.subpages && (
                <View style={styles.subMenuContainer}>
                  {menu.subpages.map((sub) => (
                    <TouchableOpacity
                      key={sub.label}
                      style={styles.subMenuItem}
                      onPress={() => {
                        closeDrawer();
                        navigation.navigate(sub.route, sub.params || {});
                      }}
                    >
                      <Text style={styles.subMenuText}>{sub.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roundImage: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#75AB38',
  },
  drawerItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerText: {
    fontSize: 16,
    color: '#333',
  },
  subMenuContainer: {
    paddingLeft: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  subMenuItem: {
    paddingVertical: 10,
  },
  subMenuText: {
    fontSize: 14,
    color: '#555',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 14,
    backgroundColor: '#f44336',
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
