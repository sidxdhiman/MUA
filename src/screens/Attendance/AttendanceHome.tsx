import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { MapPicker } from '../../components/MapPicker';
import { TimetableWizard } from '../../components/TimetableWizard';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { colors, spacing, radius } from '../../theme';
import { MapPin, Clock, Plus, UploadCloud, Calendar } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function AttendanceHome() {
    const { classes, records, campusCoords, addClass, removeClass, logAttendance, setCampusCoords } = useAttendanceStore();
    const [showAdd, setShowAdd] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

    // Form fields for simple add
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [timeStart, setTimeStart] = useState('');

    const todayDay = new Date().getDay();
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter classes for today
    const todayClasses = classes.filter(c => c.dayOfWeek === todayDay);
    const todayRecords = records.filter(r => r.date === todayStr);

    const getAttendancePercentage = () => {
        if (records.length === 0) return 0;
        const presentCount = records.filter(r => r.status === 'present').length;
        return Math.round((presentCount / records.length) * 100);
    };

    const handleSetCampus = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Allow location to use smart attendance.');
            return;
        }
        setShowMap(true);
    };

    const handleSmartCheck = async () => {
        if (!campusCoords) {
            Alert.alert("Missing Details", "Please set your Campus Location first.");
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        // Very rough distance calc (approx 200m radius)
        const R = 6371e3; // metres
        const lat1 = loc.coords.latitude * Math.PI / 180;
        const lat2 = campusCoords.lat * Math.PI / 180;
        const deltaLat = (campusCoords.lat - loc.coords.latitude) * Math.PI / 180;
        const deltaLon = (campusCoords.lon - loc.coords.longitude) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < 300) {
            if (todayClasses.length > 0) {
                // Find next class or current class based on time (simplified for demo)
                logAttendance({ classId: todayClasses[0].id, date: todayStr, status: 'present' });
                Alert.alert("Smart Attendance", `You are on campus! Marked ${todayClasses[0].title} as Present.`);
            } else {
                Alert.alert("Smart Attendance", "You are on campus, but you have no classes scheduled today.");
            }
        } else {
            Alert.alert("Smart Attendance", `You are not on campus. Distance: ${Math.round(distance)}m`);
        }
    };

    const handleAdd = () => {
        if (!title || !timeStart) return;
        addClass({
            title,
            timeStart,
            timeEnd: 'Duration 1h',
            dayOfWeek: todayDay,
            location: location || 'Campus',
            type: 'Lecture'
        });
        setTitle('');
        setLocation('');
        setTimeStart('');
        setShowAdd(false);
    };

    const handleMarkPresent = (classId: string) => {
        logAttendance({ classId, date: todayStr, status: 'present' });
    };

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <AppText variant="h2" style={styles.header}>Classes</AppText>
                    <TouchableOpacity onPress={() => setShowAdd(!showAdd)}>
                        <Plus color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: spacing.m, marginBottom: spacing.l }}>
                    <TouchableOpacity onPress={handleSetCampus} style={styles.smartPill}>
                        <MapPin size={16} color={campusCoords ? colors.attendance : colors.text} />
                        <AppText variant="caption">{campusCoords ? 'Campus Set' : 'Location'}</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowWizard(true)} style={styles.smartPill}>
                        <Calendar size={16} color={colors.text} />
                        <AppText variant="caption">Add Timetable</AppText>
                    </TouchableOpacity>
                </View>

                {campusCoords && todayClasses.length > 0 && (
                    <View style={{ marginBottom: spacing.l }}>
                        <Button title="Trigger Auto-Attendance Check Now" onPress={handleSmartCheck} variant="secondary" />
                    </View>
                )}

                {showAdd && (
                    <Card elevation="sm" style={styles.formCard}>
                        <AppText variant="title" style={{ marginBottom: spacing.m }}>Add Single Entry</AppText>
                        <Input label="Subject Name" placeholder="e.g. Data Structures" value={title} onChangeText={setTitle} />
                        <Input label="Time Start" placeholder="e.g. 10:00 AM" value={timeStart} onChangeText={setTimeStart} />
                        <Input label="Location" placeholder="e.g. Block C, Room 2" value={location} onChangeText={setLocation} />
                        <Button title="Save Class" onPress={handleAdd} />
                    </Card>
                )}

                <Card elevation="md" highlightColor={colors.attendance} style={styles.summaryCard}>
                    <AppText variant="caption" color={colors.textSecondary}>OVERALL ATTENDANCE</AppText>
                    <AppText variant="h1" color={colors.attendance}>{getAttendancePercentage()}%</AppText>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${getAttendancePercentage()}%` }]} />
                    </View>
                </Card>

                <AppText variant="title" style={styles.sectionTitle}>
                    Today's Schedule ({todayClasses.length})
                </AppText>

                {todayClasses.length === 0 ? (
                    <View style={styles.emptyState}>
                        <AppText color={colors.textLight} style={{ textAlign: 'center', marginBottom: spacing.m }}>
                            No classes scheduled for today. Add classes to start tracking.
                        </AppText>
                        <Button title="Setup Full Timetable" variant="outline" onPress={() => setShowWizard(true)} />
                    </View>
                ) : (
                    todayClasses.map((c) => {
                        const isAttended = todayRecords.some(r => r.classId === c.id && r.status === 'present');

                        return (
                            <Card key={c.id} style={[styles.classCard, isAttended && styles.attendedCard]} padding={spacing.m}>
                                <View style={styles.classTime}>
                                    <Clock color={colors.attendance} size={16} style={{ marginRight: spacing.xs }} />
                                    <AppText variant="caption" color={colors.attendance}>{c.timeStart}</AppText>
                                </View>
                                <AppText variant="title" style={isAttended && { textDecorationLine: 'line-through' }}>{c.title}</AppText>
                                <View style={styles.classLocation}>
                                    <MapPin color={colors.textSecondary} size={14} style={{ marginRight: spacing.xs }} />
                                    <AppText variant="caption" color={colors.textSecondary}>{c.location}</AppText>
                                </View>
                                <View style={[styles.actionsBox, { flexDirection: 'row', gap: spacing.m }]}>
                                    {isAttended ? (
                                        <AppText color={colors.success} variant="button">✅ Marked Present</AppText>
                                    ) : (
                                        <Button title="Mark Present manually" variant="outline" onPress={() => handleMarkPresent(c.id)} />
                                    )}
                                    <TouchableOpacity onPress={() => removeClass(c.id)} style={{ justifyContent: 'center', marginLeft: 'auto' }}>
                                        <AppText color={colors.error} variant="caption">Delete</AppText>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        );
                    })
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            <MapPicker
                visible={showMap}
                onClose={() => setShowMap(false)}
                onLocationSelect={setCampusCoords}
                initialLocation={campusCoords}
            />

            <TimetableWizard
                visible={showWizard}
                onClose={() => setShowWizard(false)}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.l },
    header: { color: colors.text },
    smartPill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, padding: spacing.m, borderRadius: radius.m, justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    formCard: { marginBottom: spacing.l },
    summaryCard: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.l },
    progressBg: { width: '100%', height: 8, backgroundColor: colors.border, borderRadius: 4, marginTop: spacing.m },
    progressFill: { height: '100%', backgroundColor: colors.attendance, borderRadius: 4 },
    sectionTitle: { marginBottom: spacing.m },
    classCard: { marginBottom: spacing.m, borderLeftWidth: 4, borderLeftColor: colors.attendance },
    attendedCard: { opacity: 0.7, borderLeftColor: colors.success },
    classTime: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
    classLocation: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
    actionsBox: { marginTop: spacing.m, alignItems: 'center' },
    emptyState: { alignItems: 'center', padding: spacing.xl },
});
