import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from '../screens/LoginPage';
import CreateAccountPage from '../screens/CreateAccountPage';
import TermsAndConditionsPage from '../screens/TermsAndConditionsPage';
import CreateActivitySelectionPage from '../screens/CreateActivitySelectionPage';
import GoalSetting from '../screens/GoalSetting';
import HomeTabs from './HomeTabs'; 
import ActivityLogPage from '../screens/ActivityLogPage';

const Stack = createStackNavigator();


export default AppNavigator;
