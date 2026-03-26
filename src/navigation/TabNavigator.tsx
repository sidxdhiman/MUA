import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator, FinanceNavigator, RemindersNavigator, HealthNavigator, MoreNavigator } from './Stacks';
import { colors, radius, spacing } from '../theme';
import { Home, Wallet, CheckSquare, HeartPulse, Grid } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: spacing.m,
                    left: spacing.m,
                    right: spacing.m,
                    elevation: 10,
                    backgroundColor: colors.card,
                    borderRadius: radius.xl, // Balanced pill shape
                    height: 72,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    borderTopWidth: 0,
                    paddingBottom: 12,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: 'System',
                    fontSize: 8,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeNavigator}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="FinanceTab"
                component={FinanceNavigator}
                options={{
                    tabBarLabel: 'Money',
                    tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="RemindersTab"
                component={RemindersNavigator}
                options={{
                    tabBarLabel: 'Tasks',
                    tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="HealthTab"
                component={HealthNavigator}
                options={{
                    tabBarLabel: 'Wellness',
                    tabBarIcon: ({ color, size }) => <HeartPulse color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="MoreTab"
                component={MoreNavigator}
                options={{
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({ color, size }) => <Grid color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
