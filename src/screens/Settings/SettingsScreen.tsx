import React from 'react';
import { View, ScrollView, StyleSheet, Switch } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { useFinanceStore } from '../../store/useFinanceStore';
import { useTasksStore } from '../../store/useTasksStore';
import { useHealthStore } from '../../store/useHealthStore';
import { useOutfitStore } from '../../store/useOutfitStore';
import { useVoiceNotesStore } from '../../store/useVoiceNotesStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useDietStore } from '../../store/useDietStore';
import { Moon, Bell } from 'lucide-react-native';

export default function SettingsScreen({ navigation }: any) {
    const { profile, modules, toggleModule, resetApp, updateProfile } = useAppStore();

    const handleLogout = () => {
        resetApp();
        useFinanceStore.setState({ transactions: [] });
        useTasksStore.setState({ tasks: [] });
        useHealthStore.setState({ logs: {} });
        useOutfitStore.setState({ wardrobe: [], savedOutfits: [] });
        useVoiceNotesStore.setState({ notes: [] });
        useAttendanceStore.setState({ classes: [], records: [] });
        useDietStore.setState({ meals: [] });
    };

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppText variant="h2" style={styles.header}>Settings</AppText>

                <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                    PROFILE
                </AppText>
                <Card style={styles.card}>
                    <AppText variant="button">Name</AppText>
                    <AppText color={colors.textSecondary}>{profile?.name}</AppText>
                </Card>
                <Card style={styles.card}>
                    <AppText variant="button">Account Type</AppText>
                    <AppText color={colors.textSecondary}>{profile?.role}</AppText>
                </Card>

                <AppText variant="caption" color={colors.textSecondary} style={[styles.sectionTitle, { marginTop: spacing.m }]}>
                    ACTIVE MODULES
                </AppText>
                <ModuleToggle title="Finance Tracker" value={modules.finance} onToggle={() => toggleModule('finance')} />
                <ModuleToggle title="Tasks & Reminders" value={modules.reminders} onToggle={() => toggleModule('reminders')} />
                <ModuleToggle title="Health Tracker" value={modules.health} onToggle={() => toggleModule('health')} />
                <ModuleToggle title="Outfit Decider" value={modules.outfit} onToggle={() => toggleModule('outfit')} />
                <ModuleToggle title="Voice Notes" value={modules.voiceNotes} onToggle={() => toggleModule('voiceNotes')} />
                <ModuleToggle title="Attendance Tracker" value={modules.attendance} onToggle={() => toggleModule('attendance')} />
                <ModuleToggle title="Diet Planner" value={modules.diet} onToggle={() => toggleModule('diet')} />

                <AppText variant="caption" color={colors.textSecondary} style={[styles.sectionTitle, { marginTop: spacing.m }]}>
                    PREFERENCES
                </AppText>
                <Card style={styles.rowCard}>
                    <View style={styles.rowItem}>
                        <Bell color={colors.textSecondary} size={20} />
                        <AppText variant="button">Notifications</AppText>
                    </View>
                    <Switch value={true} onValueChange={() => { }} trackColor={{ true: colors.primary, false: colors.border }} />
                </Card>
                <Card style={styles.rowCard}>
                    <View style={styles.rowItem}>
                        <Moon color={colors.textSecondary} size={20} />
                        <AppText variant="button">Dark Mode</AppText>
                    </View>
                    <Switch value={false} onValueChange={() => { }} trackColor={{ true: colors.primary, false: colors.border }} />
                </Card>

                <View style={{ marginTop: spacing.xl, paddingHorizontal: spacing.m }}>
                    <View style={styles.logoutBtn}>
                        <AppText variant="button" color={colors.error} onPress={handleLogout}>Reset App Data & Restart Onboarding</AppText>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </Screen>
    );
}

function ModuleToggle({ title, value, onToggle }: any) {
    return (
        <Card style={styles.rowCard}>
            <AppText variant="button">{title}</AppText>
            <Switch value={value} onValueChange={onToggle} trackColor={{ true: colors.primary, false: colors.border }} />
        </Card>
    )
}

const styles = StyleSheet.create({
    header: { marginBottom: spacing.l, color: colors.text },
    sectionTitle: { marginBottom: spacing.m },
    card: { marginBottom: spacing.s, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.m },
    rowCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.s, padding: spacing.m },
    rowItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
    logoutBtn: { padding: spacing.m, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.error + '10', borderRadius: 8 },
});
