import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { SummaryCard } from '../../components/SummaryCard';
import { Button } from '../../components/Button';
import { useAppStore } from '../../store/useAppStore';
import { useTasksStore } from '../../store/useTasksStore';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useHealthStore } from '../../store/useHealthStore';
import { useOutfitStore } from '../../store/useOutfitStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useDietStore } from '../../store/useDietStore';
import { colors, spacing, radius } from '../../theme';
import { Wallet, CheckSquare, HeartPulse, Sparkles, MapPin, Apple, Mic, LogOut, User } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export default function HomeDashboard({ navigation }: any) {
    const { profile, modules, resetApp } = useAppStore();
    const tasks = useTasksStore(s => s.tasks);
    const transactions = useFinanceStore(s => s.transactions);

    const todayStr = new Date().toISOString().split('T')[0];
    const healthToday = useHealthStore(s => s.getLog(todayStr));
    const wardrobe = useOutfitStore(s => s.wardrobe);
    const dietMeals = useDietStore(s => s.meals);

    useEffect(() => {
        // Schedule 9:30 PM summary
        Notifications.scheduleNotificationAsync({
            content: {
                title: "DayStack Evening Summary 🌙",
                body: `Hope you had a great day! Don't forget to wind down and review your logs.`,
            },
            trigger: {
                type: 'calendar',
                hour: 21,
                minute: 30,
                repeats: true
            } as any,
        });
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const pendingTasks = tasks.filter(t => !t.completed);
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const handleLogout = () => {
        resetApp();
        useFinanceStore.setState({ transactions: [] });
        useTasksStore.setState({ tasks: [] });
        useHealthStore.setState({ logs: {} });
        useOutfitStore.setState({ wardrobe: [], savedOutfits: [] });
        useAttendanceStore.setState({ classes: [], records: [] });
        useDietStore.setState({ meals: [] });
    };

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <AppText variant="h2" style={styles.greeting}>
                            {getGreeting()}, {profile?.name || 'There'} 👋
                        </AppText>
                        <AppText variant="body" color={colors.textSecondary}>
                            Here's what your day looks like.
                        </AppText>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.profilLogout}>
                        <LogOut color={colors.text} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.quickActions}>
                    {modules.finance && <QuickAction icon={<Wallet size={20} color={colors.finance} />} label="Money" bg={colors.finance} onPress={() => navigation.navigate('FinanceTab')} />}
                    {modules.reminders && <QuickAction icon={<CheckSquare size={20} color={colors.reminders} />} label="Tasks" bg={colors.reminders} onPress={() => navigation.navigate('RemindersTab')} />}
                    {modules.health && <QuickAction icon={<HeartPulse size={20} color={colors.health} />} label="Wellness" bg={colors.health} onPress={() => navigation.navigate('HealthTab')} />}
                    {modules.voiceNotes && <QuickAction icon={<Mic size={20} color={colors.voice} />} label="Note" bg={colors.voice} onPress={() => navigation.navigate('MoreTab', { screen: 'VoiceNotesHome' })} />}
                </View>

                {modules.reminders && (
                    <SummaryCard
                        title={pendingTasks.length > 0 ? "Upcoming Horizon" : "All Caught Up!"}
                        subtitle={pendingTasks.length > 0 ? `${pendingTasks.length} pending task(s)` : "You have no pending tasks."}
                        accentColor={colors.reminders}
                        icon={<CheckSquare size={24} color={colors.reminders} />}
                        onPress={() => navigation.navigate('RemindersTab')}
                        content={
                            <View>
                                {pendingTasks.length === 0 ? (
                                    <Button title="Add New Task" variant="outline" onPress={() => navigation.navigate('RemindersTab')} />
                                ) : (
                                    pendingTasks.slice(0, 3).map(t => (
                                        <TaskItem key={t.id} title={t.title} priority={t.priority} />
                                    ))
                                )}
                            </View>
                        }
                    />
                )}

                {modules.health && (
                    <SummaryCard
                        title="Wellness Progress"
                        subtitle={`${healthToday.steps.toLocaleString()} steps today`}
                        accentColor={colors.health}
                        icon={<HeartPulse size={24} color={colors.health} />}
                        onPress={() => navigation.navigate('HealthTab')}
                        content={
                            <View style={styles.metricsRow}>
                                <MetricItem label="Steps" val={healthToday.steps} max="10k" color={colors.health} />
                                <MetricItem label="Water" val={healthToday.water} max="8G" color={colors.voice} />
                                <MetricItem label="Sleep" val={healthToday.sleep} max="8H" color={colors.outfit} />
                            </View>
                        }
                    />
                )}

                {modules.finance && (
                    <SummaryCard
                        title="Money Snapshot"
                        subtitle={transactions.length > 0 ? `Net Balance: ₹${(income - expense).toFixed(2)}` : 'No transactions recorded'}
                        accentColor={colors.finance}
                        icon={<Wallet size={24} color={colors.finance} />}
                        onPress={() => navigation.navigate('FinanceTab')}
                        content={
                            transactions.length === 0 ?
                                <Button title="Log First Expense" variant="outline" onPress={() => navigation.navigate('FinanceTab')} /> :
                                <View style={styles.flexRow}>
                                    <AppText variant="body" color={colors.textSecondary}>Spend: ₹{expense.toFixed(2)}</AppText>
                                    <AppText variant="body" color={colors.success}>In: ₹{income.toFixed(2)}</AppText>
                                </View>
                        }
                    />
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </Screen>
    );
}

function QuickAction({ icon, label, bg, onPress }: any) {
    return (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={[styles.actionIcon, { backgroundColor: bg + '20' }]}>
                {icon}
            </View>
            <AppText variant="caption">{label}</AppText>
        </TouchableOpacity>
    );
}

function TaskItem({ title, priority }: any) {
    return (
        <View style={styles.taskRow}>
            <View style={[styles.dot, { backgroundColor: priority === 'high' ? colors.reminders : colors.info }]} />
            <AppText style={{ flex: 1, marginLeft: spacing.s }} numberOfLines={1}>{title}</AppText>
        </View>
    );
}

function MetricItem({ label, val, max, color }: any) {
    return (
        <View style={styles.metricCard}>
            <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
            <AppText variant="title" color={color}>{val}</AppText>
            <AppText variant="caption" color={colors.textLight}>/ {max}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { marginVertical: spacing.l, flexDirection: 'row', alignItems: 'center' },
    profilLogout: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
    greeting: { color: colors.text },
    quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.l, backgroundColor: colors.card, padding: spacing.m, borderRadius: radius.l, },
    actionItem: { alignItems: 'center', gap: spacing.xs },
    actionIcon: { width: 48, height: 48, borderRadius: radius.m, justifyContent: 'center', alignItems: 'center', },
    taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.s, paddingVertical: 4, },
    dot: { width: 8, height: 8, borderRadius: 4 },
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    metricCard: { alignItems: 'center', backgroundColor: colors.background, padding: spacing.s, borderRadius: radius.s, flex: 1, marginHorizontal: spacing.xs, },
    flexRow: { flexDirection: 'row', justifyContent: 'space-between' }
});
