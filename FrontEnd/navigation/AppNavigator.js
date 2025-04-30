import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from '../screens/LoginPage';
import CreateAccountPage from '../screens/CreateAccountPage';
import TermsAndConditionsPage from '../screens/TermsAndConditionsPage';
import CreateActivitySelectionPage from '../screens/CreateActivitySelectionPage';
import SettingsPage from '../screens/SettingsPage';
import ChatPage from '../screens/ChatPage';
import RecommendationPage from '../screens/RecommendationPage';
import UserProfilePage from '../screens/UserProfilePage';
import GroupProfilePage from '../screens/GroupProfilePage';

import GoalSetting from '../screens/GoalSetting';
import HomeTabs from './HomeTabs'; 
import ActivityLogPage from '../screens/ActivityLogPage';
import GroupChatInfoPage from '../screens/GroupChatInfoPage.js';
import CreateGroupPage from '../screens/CreateGroupPage.js';
import ExtraInformationPage from '../screens/ExtraInformationPage';

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
                <Stack.Screen name="Recommendation" component={RecommendationPage} options={{headerShown:false}}/>
                <Stack.Screen name="UserProfile" component={UserProfilePage} options={{headerShown:false}}/>
                <Stack.Screen name="GroupProfile" component={GroupProfilePage} options={{headerShown:false}}/>
                <Stack.Screen name="GroupChatInfo" component={GroupChatInfoPage} options={{headerShown:false}}/>
                <Stack.Screen name="CreateGroup" component={CreateGroupPage} options={{headerShown:false}}/>
                <Stack.Screen name="ExtraInformation" component={ExtraInformationPage} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default  AppNavigator;
