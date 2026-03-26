import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList, FinanceStackParamList, RemindersStackParamList, HealthStackParamList, MoreStackParamList } from './types';

import HomeDashboard from '../screens/Home/HomeDashboard';
import FinanceHome from '../screens/Finance/FinanceHome';
import RemindersHome from '../screens/Reminders/RemindersHome';
import HealthDashboard from '../screens/Health/HealthDashboard';
import MoreMenu from '../screens/More/MoreMenu';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
export const HomeNavigator = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="HomeDashboard" component={HomeDashboard} />
    </HomeStack.Navigator>
);

const FinanceStack = createNativeStackNavigator<FinanceStackParamList>();
export const FinanceNavigator = () => (
    <FinanceStack.Navigator screenOptions={{ headerShown: false }}>
        <FinanceStack.Screen name="FinanceHome" component={FinanceHome} />
    </FinanceStack.Navigator>
);

const RemindersStack = createNativeStackNavigator<RemindersStackParamList>();
export const RemindersNavigator = () => (
    <RemindersStack.Navigator screenOptions={{ headerShown: false }}>
        <RemindersStack.Screen name="RemindersHome" component={RemindersHome} />
    </RemindersStack.Navigator>
);

const HealthStack = createNativeStackNavigator<HealthStackParamList>();
export const HealthNavigator = () => (
    <HealthStack.Navigator screenOptions={{ headerShown: false }}>
        <HealthStack.Screen name="HealthDashboard" component={HealthDashboard} />
    </HealthStack.Navigator>
);

import VoiceNotesHome from '../screens/VoiceNotes/VoiceNotesHome';
import OutfitHome from '../screens/Outfit/OutfitHome';
import AttendanceHome from '../screens/Attendance/AttendanceHome';
import DietHome from '../screens/Diet/DietHome';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const MoreStack = createNativeStackNavigator<MoreStackParamList>();
export const MoreNavigator = () => (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
        <MoreStack.Screen name="MoreMenu" component={MoreMenu} />
        <MoreStack.Screen name="VoiceNotesHome" component={VoiceNotesHome} />
        <MoreStack.Screen name="OutfitHome" component={OutfitHome} />
        <MoreStack.Screen name="AttendanceHome" component={AttendanceHome} />
        <MoreStack.Screen name="DietHome" component={DietHome} />
        <MoreStack.Screen name="Settings" component={SettingsScreen} />
    </MoreStack.Navigator>
);
