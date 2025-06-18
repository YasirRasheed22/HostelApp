import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '../screens/HomeTab';
import Tenants from '../screens/Tenants';
import Reports from '../screens/Reports';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { font } from '../components/ThemeStyle';

const Tab = createBottomTabNavigator();

const DashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: font.primary,
            fontSize: 10,
          },
        }}
      />

      <Tab.Screen
        name="Tenants"
        options={{
          headerShown: true,
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
           tabBarLabelStyle: {
            fontFamily: font.primary,
            fontSize: 10,
          },
        }}
        component={Tenants}
      />
      <Tab.Screen
        name="Reports"
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="files-o" size={size} color={color} />
          ),
           tabBarLabelStyle: {
            fontFamily: font.primary, 
            fontSize: 10,
          },
        }}
        component={Reports}
      />
    </Tab.Navigator>
  );
};

export default DashboardTabs;
