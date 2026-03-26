import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import { useAppStore } from '../store/useAppStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const isFirstLaunch = useAppStore((state) => state.isFirstLaunch);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isFirstLaunch ? (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
                <Stack.Screen name="MainTabs" component={TabNavigator} />
            )}
        </Stack.Navigator>
    );
}
