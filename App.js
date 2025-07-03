import React, { useEffect } from 'react';
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
import AddRoom from './src/screens/AddRoom';
import AddTenant from './src/screens/AddTenant';
import AddStaff from './src/screens/AddStaff';
import ActiveTenantReport from './src/screens/ActiveTenantReport';
import InActiveTenantReport from './src/screens/InActiveTenantReport';
import AssetReport from './src/screens/AssetReport';
import ProfitAndLossReport from './src/screens/ProfitAndLossReport';
import { font } from './src/components/ThemeStyle';
import TenentView from './src/screens/TenentView';
import EditTenant from './src/screens/EditTenant';
import RoomView from './src/screens/RoomView';
import EditRoom from './src/screens/EditRoom';
import StaffView from './src/screens/StaffView';
import EditStaff from './src/screens/EditStaff';
import AddAsset from './src/screens/AddAsset';
import Assets from './src/screens/Assets';
import AssetView from './src/screens/AssetView';
import Expenses from './src/screens/Expenses';
import AddExpense from './src/screens/AddExpense';
import ExpenseView from './src/screens/ExpenseView';
import GenerateAttendence from './src/screens/GenerateAttendence';
import MarkAttendence from './src/screens/MarkAttendence';
import AttendenceList from './src/screens/AttendenceList';
import AttendenceView from './src/screens/AttendenceView';
import LeavePage from './src/screens/LeavesPage';
import ApplyLeave from './src/screens/ApplyLeave';
import LeaveList from './src/screens/LeaveList';
import AddPerk from './src/screens/AddPerk';
import PerkList from './src/screens/PerkList';
import FeeList from './src/screens/FeeList';
import GenerateFee from './src/screens/GenerateFee';
import OrganizationProfile from './src/screens/OrganizationProfile';
import AddPayment from './src/screens/AddPayment';
import Payments from './src/screens/payments';
import ReportGen from './src/screens/ReportGen';
import EditAsset from './src/screens/EditAsset';
import FeeInvoiceScreen from './src/screens/FeeView';
import EditPerk from './src/screens/EditPerk';
import EditExpense from './src/screens/EditExpense';
import EditPayment from './src/screens/EditPayment';
import EditFee from './src/screens/EditFee';
import EditLeave from './src/screens/EditLeave';
import Announcements from './src/screens/Announcements';
import ForgetPassword from './src/screens/ForgetPassword';
import Profile from './src/screens/Profile';
// import Orientation from 'react-native-orientation-locker';

const Stack = createNativeStackNavigator();

export default function App() {


// useEffect(() => {
//   Orientation.lockToPortrait();
// }, []);



  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen  name="Login" component={LoginScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="StaffMember" component={StaffMember}  options={{ headerShown: true }}/>
        <Stack.Screen name="ActiveMember" component={ActiveTenants}  options={{ headerShown: true }}/>
        <Stack.Screen name="InactiveMember" component={InActiveTenants}  options={{ headerShown: true  }}/>
        <Stack.Screen name="Rooms" component={Rooms}  options={{ headerShown: true }}/>
        <Stack.Screen name="Payments" component={Amount}  options={{ headerShown: true }}/>
        <Stack.Screen name="Attendance" component={Attendence}  options={{ headerShown: true }}/>
        <Stack.Screen name="AddRoom" component={AddRoom}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AddTenant" component={AddTenant}  options={{ headerShown: true,  headerTitleStyle: {fontFamily: font.secondary,fontSize: 20}}}/>
        <Stack.Screen name="EditTenant" component={EditTenant}  options={{ headerShown: true,  headerTitleStyle: {fontFamily: font.secondary,fontSize: 20}}}/>
        <Stack.Screen name="AddStaff" component={AddStaff}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="ActiveTenantReport" component={ActiveTenantReport}  options={{ headerShown: true }}/>
        <Stack.Screen name="InActiveTenantReport" component={InActiveTenantReport}  options={{ headerShown: true }}/>
        <Stack.Screen name="AssetReport" component={AssetReport}  options={{ headerShown: true }}/>
        <Stack.Screen name="ProfitAndLossReport" component={ProfitAndLossReport}  options={{ headerShown: true }}/>
        <Stack.Screen name="TenantView" component={TenentView}   options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="RoomView" component={RoomView}   options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditRoom" component={EditRoom}   options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="StaffView" component={StaffView}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditStaff" component={EditStaff}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AddAsset" component={AddAsset}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="Assets" component={Assets}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AssetView" component={AssetView}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="Expenses" component={Expenses}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AddExpense" component={AddExpense}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="ExpenseView" component={ExpenseView}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="GenerateAttendence" component={GenerateAttendence}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="MarkAttendence" component={MarkAttendence}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AttendenceList" component={AttendenceList}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AttendenceView" component={AttendenceView}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="LeavePage" component={LeavePage}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="ApplyLeave" component={ApplyLeave}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="LeaveList" component={LeaveList}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AddPerk" component={AddPerk}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="PerkList" component={PerkList}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="FeeList" component={FeeList}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="GenerateFee" component={GenerateFee}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="OrganizationProfile" component={OrganizationProfile}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="AddPayment" component={AddPayment}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="payments" component={Payments}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="ReportGen" component={ReportGen}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditAsset" component={EditAsset}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="FeeView" component={FeeInvoiceScreen}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditPerk" component={EditPerk}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditExpense" component={EditExpense}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditPayment" component={EditPayment}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditFee" component={EditFee}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="EditLeave" component={EditLeave}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="Announcements" component={Announcements}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="ForgetPassword" component={ForgetPassword}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
        <Stack.Screen name="Profile" component={Profile}  options={{ headerShown: true , headerTitleStyle: {fontFamily: font.secondary,fontSize: 20} }}/>
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
