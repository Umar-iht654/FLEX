import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import FeedPage from '../screens/FeedPage';
import SearchPage from '../screens/SearchPage';
import ActivityLogPage from '../screens/ActivityLogPage';
import MessagesPage from '../screens/MessagesPage';
import ProfilePage from '../screens/ProfilePage';
import GoalSetting from '../screens/GoalSetting';
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: 'white', height: 60 },
        tabBarItemStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        tabBarIconStyle: { marginTop: 10 }
      }}
    >
      <Tab.Screen 
        name="Feed" 
        component={FeedPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={require('../assets/FeedIcon.png')} style={{ width: 120, height: 120 }} />
          ), 
          headerShown: false
        }}
      /> 
      <Tab.Screen 
        name="Search" 
        component={SearchPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={require('../assets/SearchIcon.png')} style={{ width: 120, height: 120 }} />
          ), 
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="ActivityLog" 
        component={GoalSetting} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={require('../assets/ActivityLogIcon.png')} style={{ width: 120, height: 120 }} />
          ), 
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={require('../assets/MessageIcon.png')} style={{ width: 120, height: 120 }} />
          ), 
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={require('../assets/ProfileIcon.png')} style={{ width: 120, height: 120 }} />
          ), 
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
