import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '../screens/HomeTab';
import Tenants from '../screens/Tenants';
import Reports from '../screens/Reports';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
        component={HomeTab}
      />
      <Tab.Screen name="Tenants" options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }} component={Tenants} />
      <Tab.Screen name="Reports" options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="files-o" size={size} color={color} />
          ),
        }} component={Reports} />
    </Tab.Navigator>
  );
};

export default DashboardTabs;
