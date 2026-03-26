import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { colors, spacing, radius } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import {
    Sparkles, Mic, MapPin, Apple, Settings, ChevronRight, PieChart
} from 'lucide-react-native';

export default function MoreMenu({ navigation }: any) {
    const { modules } = useAppStore();

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppText variant="h2" style={styles.header}>Explore</AppText>

                <View style={styles.section}>
                    <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                        SMART TOOLS
                    </AppText>
                    {modules.outfit && (
                        <MenuItem
                            icon={<Sparkles size={24} color={colors.outfit} />}
                            title="Outfit Decider"
                            desc="AI wardrobe & style suggestions"
                            bg={colors.outfit}
                            onPress={() => navigation.navigate('OutfitHome')}
                        />
                    )}
                    {modules.voiceNotes && (
                        <MenuItem
                            icon={<Mic size={24} color={colors.voice} />}
                            title="Voice Notes"
                            desc="Transcribe ideas instantly"
                            bg={colors.voice}
                            onPress={() => navigation.navigate('VoiceNotesHome')}
                        />
                    )}
                    {!modules.outfit && !modules.voiceNotes && (
                        <AppText color={colors.textLight} style={{ marginLeft: spacing.xs }}>No smart tools enabled.</AppText>
                    )}
                </View>

                <View style={styles.section}>
                    <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                        LIFESTYLE & TRACKING
                    </AppText>
                    {modules.attendance && (
                        <MenuItem
                            icon={<MapPin size={24} color={colors.attendance} />}
                            title="Attendance Tracker"
                            desc="Location & schedule based"
                            bg={colors.attendance}
                            onPress={() => navigation.navigate('AttendanceHome')}
                        />
                    )}
                    {modules.diet && (
                        <MenuItem
                            icon={<Apple size={24} color={colors.diet} />}
                            title="Diet Planner"
                            desc="Meal prep & reminders"
                            bg={colors.diet}
                            onPress={() => navigation.navigate('DietHome')}
                        />
                    )}
                    {modules.finance && (
                        <MenuItem
                            icon={<PieChart size={24} color={colors.finance} />}
                            title="Analytics"
                            desc="Your spending report"
                            bg={colors.finance}
                            onPress={() => navigation.navigate('FinanceTab')}
                        />
                    )}
                    {!modules.attendance && !modules.diet && !modules.finance && (
                        <AppText color={colors.textLight} style={{ marginLeft: spacing.xs }}>No tracking modules enabled.</AppText>
                    )}
                </View>

                <View style={styles.section}>
                    <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                        PREFERENCES
                    </AppText>
                    <MenuItem
                        icon={<Settings size={24} color={colors.textLight} />}
                        title="Settings & Privacy"
                        desc="Setup, UI, Sync"
                        bg={colors.text}
                        onPress={() => navigation.navigate('Settings')}
                    />
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </Screen>
    );
}

function MenuItem({ title, desc, icon, bg, onPress }: any) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: bg + '20' }]}>
                {icon}
            </View>
            <View style={styles.textStack}>
                <AppText variant="title">{title}</AppText>
                <AppText variant="caption" color={colors.textSecondary}>{desc}</AppText>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    header: { marginBottom: spacing.l, color: colors.text },
    section: { marginBottom: spacing.l },
    sectionTitle: { marginBottom: spacing.m, marginLeft: spacing.xs, letterSpacing: 1 },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
        padding: spacing.m, borderRadius: radius.m, marginBottom: spacing.s,
    },
    iconBox: {
        width: 48, height: 48, borderRadius: radius.round,
        justifyContent: 'center', alignItems: 'center', marginRight: spacing.m,
    },
    textStack: { flex: 1 },
});
