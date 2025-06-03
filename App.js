import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
// import DashboardScreen from './src/screens/DashboardScreen';
import DashboardTabs from './src/navigation/DashboardTabs';
// import DrawerComp from './src/screens/DrawerComp';
import StaffMember from './src/screens/StaffMember';
import ActiveTenants from './src/screens/ActiveTenants';
import { PaperProvider } from 'react-native-paper';
import InActiveTenants from './src/screens/InActiveTenants';
import Rooms from './src/screens/Rooms';
import Amount from './src/screens/Amount';
import Attendence from './src/screens/Attendence';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen  name="Login" component={LoginScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="StaffMember" component={StaffMember}  options={{ headerShown: false }}/>
        <Stack.Screen name="ActiveMember" component={ActiveTenants}  options={{ headerShown: false }}/>
        <Stack.Screen name="InactiveMember" component={InActiveTenants}  options={{ headerShown: false }}/>
        <Stack.Screen name="Rooms" component={Rooms}  options={{ headerShown: false }}/>
        <Stack.Screen name="Payments" component={Amount}  options={{ headerShown: false }}/>
        <Stack.Screen name="Attendance" component={Attendence}  options={{ headerShown: false }}/>
        <Stack.Screen
          name="Dashboard"
          component={DashboardTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
