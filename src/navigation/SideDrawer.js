import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

export const SideDrawer = ({ drawerAnim, drawerOpen, closeDrawer, navigation }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const menus = [
    {
      label: 'Dashboard',

    },
    {
      label: 'Tenants',
      subpages: [
        { label: 'Add New', route: 'AddTenant' },
        { label: 'List', route: 'Tenants' },
      ],
    },
    {
      label: 'Staff',
      subpages: [
        { label: 'Add New', route: 'AddStaff' },
        { label: 'List', route: 'StaffMember' },
      ],
    },
    {
      label: 'Rooms',
      subpages: [
        { label: 'List', route: 'Rooms', params: { data: 'AllRoom' } },
        { label: 'Add New', route: 'AddStaff' },
      ],
    },
    {
      label: 'Assets',
      subpages: [
        { label: 'Add New', route: 'AddAsset' },
        { label: 'List', route: 'Assets' },
      ],
    },
    {
      label: 'Attendance',
      subpages: [
        { label: 'List', route: 'Attendance' },
        { label: 'Mark Attendence', route: 'GenerateAttendence' },
        { label: 'Leaves', route: 'LeavePage' },
      ],
    },
    {
      label: 'Fee / Billing',
      subpages: [
        { label: 'List', route: 'FeeList' },
        { label: 'Perks', route: 'PerkList' },
      ],
    },
    {
      label: 'Account',
      subpages: [
        { label: 'Expenses', route: 'AddExpense' },
      ],
    },




  ];

  const toggleMenu = (label) => {
    if (openMenu === label) setOpenMenu(null);
    else setOpenMenu(label);
  };

  return (
    <>
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

        {menus.map((menu) => (
          <View key={menu.label}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => toggleMenu(menu?.label)}
            >
              <Text style={styles.drawerText}>{menu.label}</Text>
              <Entypo
                name={openMenu === menu.label ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#333"
              />
            </TouchableOpacity>

            {openMenu === menu?.label && (
              <View style={styles.subMenuContainer}>
                {menu?.subpages?.map((sub) => (
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

  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
});
