import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from '../screens/LoginPage';
import CreateAccountPage from '../screens/CreateAccountPage';
import TermsAndConditionsPage from '../screens/TermsAndConditionsPage';
import CreateActivitySelectionPage from '../screens/CreateActivitySelectionPage';
import SettingsPage from '../screens/SettingsPage';
import ChatPage from '../screens/ChatPage';

import GoalSetting from '../screens/GoalSetting';
import HomeTabs from './HomeTabs'; 
import ActivityLogPage from '../screens/ActivityLogPage';

const Stack = createStackNavigator();

const AppNavigator = () =>{
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} options={{headerShown:false}}/>
                <Stack.Screen name="CreateAccount" component={CreateAccountPage} options={{headerShown:false}}/>
                <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsPage} options={{headerShown:false}}/>
                <Stack.Screen name="CreateActivitySelection" component={CreateActivitySelectionPage} options={{headerShown:false}}/>
                <Stack.Screen name="GoalSetting" component={GoalSetting} options={{headerShown:false}}/>
                <Stack.Screen name="Home" component={HomeTabs} options={{headerShown:false}}/>
                <Stack.Screen name="Settings" component={SettingsPage} options={{headerShown:false}}/>
                <Stack.Screen name="Chat" component={ChatPage} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default  AppNavigator;
