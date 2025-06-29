import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../screens/HomeTab';
import Tenants from '../screens/Tenants';
import Reports from '../screens/Reports';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { font } from '../components/ThemeStyle';

const Tab = createBottomTabNavigator();

const DashboardTabs = () => {
  const [allowedTabs, setAllowedTabs] = useState(null);

  useEffect(() => {
    const fetchPrivileges = async () => {
      try {
        const data = await AsyncStorage.getItem('privileges');
        if (data) {
          setAllowedTabs(JSON.parse(data));
        } else {
          setAllowedTabs(null); // Show all if privileges not found
        }
      } catch (err) {
        console.log('Error fetching privileges:', err);
        setAllowedTabs(null); // Fallback: show all
      }
    };

    fetchPrivileges();
  }, []);

  const screens = [
    {
      name: 'Home',
      component: HomeTab,
      icon: 'home',
      key: null, // Always visible
    },
    {
      name: 'Tenants',
      component: Tenants,
      icon: 'users',
      key: 'tenants',
    },
    {
      name: 'Reports',
      component: Reports,
      icon: 'files-o',
      key: 'reports',
    },
  ];

  const filteredScreens = screens.filter(screen => {
    if (!allowedTabs) return true;       // Show all if no restrictions
    if (!screen.key) return true;        // Always show screens with no key
    return allowedTabs[screen.key];      // Show only if privilege is true
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#75AB38',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      {filteredScreens.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            headerShown: screen.name === 'Tenants', // only for Tenants
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name={screen.icon} size={size} color={color} />
            ),
            tabBarLabelStyle: {
              fontFamily: font.primary,
              fontSize: 10,
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default DashboardTabs;
