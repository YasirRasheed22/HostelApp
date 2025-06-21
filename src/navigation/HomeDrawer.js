// HomeDrawer.js

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeTab from '../screens/HomeTab'; // this is your existing Home screen
import DrawerContent from '../components/DrawerContent'; // optional custom drawer

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true, // Enable header to show the drawer button
      }}
      drawerContent={(props) => <DrawerContent {...props} />} // Optional
    >
      <Drawer.Screen
        name="HomeMain"
        component={HomeTab}
        options={({ navigation }) => ({
          title: 'Home',
          headerLeft: () => (
            <FontAwesome.Button
              name="bars"
              size={20}
              backgroundColor="transparent"
              underlayColor="transparent"
              color="black"
              onPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

export default HomeDrawer;
