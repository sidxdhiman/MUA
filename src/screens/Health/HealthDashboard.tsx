import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useHealthStore } from '../../store/useHealthStore';
import { colors, spacing, radius } from '../../theme';
import { Flame, Droplets, Moon, Footprints, Smile, Bell } from 'lucide-react-native';
import { Pedometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

export default function HealthDashboard() {
    const { updateLog, getLog, logs } = useHealthStore();
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [modalData, setModalData] = useState<any>(null);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = getLog(todayStr);

    useEffect(() => {
        let subscription: Pedometer.Subscription;
        Pedometer.isAvailableAsync().then(
            result => {
                setIsPedometerAvailable(String(result));
                if (result) {
                    subscription = Pedometer.watchStepCount(result => {
                        updateLog(todayStr, { steps: todayLog.steps + result.steps });
                    });
                }
            },
            error => setIsPedometerAvailable('Could not get isAvailableAsync')
        );
        return () => subscription && subscription.remove();
    }, [todayStr]);

    const scheduleWaterReminder = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hydration Check! 💧",
                body: "Don't forget to drink a glass of water to meet your daily goal.",
            },
            trigger: {
                type: 'timeInterval',
                seconds: 3600, // 1 hour
                repeats: false
            } as any,
        });
        alert("Water reminder scheduled for 1 hour from now.");
    };

    const incrementWater = () => updateLog(todayStr, { water: todayLog.water + 1 });
    const incrementSleep = () => updateLog(todayStr, { sleep: (todayLog.sleep || 0) + 1 });

    const moods = [
        { emoji: '😁', label: 'Great' },
        { emoji: '🙂', label: 'Good' },
        { emoji: '😐', label: 'Okay' },
        { emoji: '😔', label: 'Low' },
    ];

    // Heatmap prep - simple last 30 days
    const pastDays = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dStr = d.toISOString().split('T')[0];
        const lg = getLog(dStr);
        let score = 0;
        if (lg.water >= 8) score += 1;
        if (lg.sleep >= 7) score += 1;
        if (lg.steps >= 5000) score += 1;
        return { date: dStr, score, log: lg };
    });

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppText variant="h2" style={styles.header}>Wellness Progress</AppText>

                <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                    DAILY TRACKERS
                </AppText>

                <View style={styles.grid}>
                    <Card style={styles.gridItem}>
                        <View style={styles.trackerHeader}>
                            <Droplets color={colors.voice} size={24} />
                        </View>
                        <AppText variant="title" style={{ marginVertical: spacing.s }}>
                            {todayLog.water} / 8 <AppText variant="caption">glasses</AppText>
                        </AppText>
                        <View style={{ gap: spacing.s, width: '100%' }}>
                            <Button title="+ Add" variant="outline" onPress={incrementWater} />
                            <TouchableOpacity onPress={scheduleWaterReminder} style={styles.remindBtn}>
                                <Bell color={colors.voice} size={14} />
                                <AppText variant="caption" color={colors.voice}>Remind</AppText>
                            </TouchableOpacity>
                        </View>
                    </Card>

                    <Card style={styles.gridItem}>
                        <View style={styles.trackerHeader}>
                            <Moon color={colors.outfit} size={24} />
                        </View>
                        <AppText variant="title" style={{ marginVertical: spacing.s }}>
                            {todayLog.sleep} <AppText variant="caption">hours</AppText>
                        </AppText>
                        <Button title="+ Log Sleep" variant="outline" onPress={incrementSleep} />
                    </Card>
                </View>

                <Card style={styles.fullWidthCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m }}>
                        <Footprints color={colors.health} size={24} style={{ marginRight: spacing.s }} />
                        <AppText variant="title">Real-Time Steps ({isPedometerAvailable === 'true' ? 'Active' : 'Offline'})</AppText>
                    </View>
                    <View style={styles.progressRow}>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${Math.min((todayLog.steps / 10000) * 100, 100)}%` }]} />
                        </View>
                        <AppText variant="caption" style={{ marginLeft: spacing.m }}>
                            {todayLog.steps} / 10k
                        </AppText>
                    </View>
                </Card>

                <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>MOOD</AppText>
                <Card style={styles.moodCard}>
                    <View style={styles.moodsRow}>
                        {moods.map((m) => (
                            <TouchableOpacity key={m.label} style={[styles.moodItem, todayLog.mood === m.label && styles.moodItemActive]} onPress={() => updateLog(todayStr, { mood: m.label })}>
                                <AppText style={{ fontSize: 24 }}>{m.emoji}</AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>30-DAY HISTORY HEATMAP</AppText>
                <Card style={{ padding: spacing.m, marginBottom: spacing.xxl }}>
                    <View style={styles.heatmapGrid}>
                        {pastDays.map(d => (
                            <TouchableOpacity
                                key={d.date}
                                onPress={() => setModalData(d)}
                                style={[
                                    styles.heatCell,
                                    { backgroundColor: d.score === 0 ? colors.border : d.score === 1 ? colors.health + '40' : d.score === 2 ? colors.health + '80' : colors.health }
                                ]}
                            />
                        ))}
                    </View>
                </Card>

                <View style={{ height: 100 }} />
            </ScrollView>

            {modalData && (
                <Modal transparent visible={!!modalData} animationType="fade">
                    <View style={styles.modalBg}>
                        <View style={styles.modalCard}>
                            <AppText variant="title" style={{ marginBottom: spacing.m }}>{modalData.date}</AppText>
                            <AppText>Steps: {modalData.log.steps}</AppText>
                            <AppText>Water: {modalData.log.water} glasses</AppText>
                            <AppText>Sleep: {modalData.log.sleep} hours</AppText>
                            <AppText>Mood: {modalData.log.mood}</AppText>
                            <View style={{ marginTop: spacing.l }}>
                                <Button title="Close" onPress={() => setModalData(null)} />
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: { marginBottom: spacing.l, color: colors.text },
    sectionTitle: { marginBottom: spacing.m, letterSpacing: 1, marginTop: spacing.l },
    grid: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.m },
    gridItem: { flex: 1, padding: spacing.m, alignItems: 'center' },
    trackerHeader: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    remindBtn: { flexDirection: 'row', alignItems: 'center', padding: spacing.xs, backgroundColor: colors.voice + '20', borderRadius: radius.s, alignSelf: 'center', gap: 4 },
    fullWidthCard: { padding: spacing.l, marginBottom: spacing.xs },
    progressRow: { flexDirection: 'row', alignItems: 'center' },
    progressBarBg: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: colors.health, borderRadius: 4 },
    moodCard: { padding: spacing.m, marginBottom: spacing.xs },
    moodsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    moodItem: { alignItems: 'center', padding: spacing.s, borderRadius: radius.m },
    moodItemActive: { backgroundColor: colors.primary + '20' },
    heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    heatCell: { width: 24, height: 24, borderRadius: 4 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { width: 300, backgroundColor: colors.card, padding: spacing.xl, borderRadius: radius.l }
});
