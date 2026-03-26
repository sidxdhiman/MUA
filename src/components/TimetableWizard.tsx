import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { colors, spacing, radius } from '../theme';
import { X, Plus, Trash2, UploadCloud, Calendar, ChevronRight, ChevronLeft, Save } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAttendanceStore, ClassSlot } from '../store/useAttendanceStore';

interface TimetableWizardProps {
    visible: boolean;
    onClose: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimetableWizard({ visible, onClose }: TimetableWizardProps) {
    const { classes, setClasses } = useAttendanceStore();
    const [localClasses, setLocalClasses] = useState<ClassSlot[]>(JSON.parse(JSON.stringify(classes)));
    const [currentDay, setCurrentDay] = useState(1); // Monday
    const [loading, setLoading] = useState(false);

    const dayClasses = localClasses.filter(c => c.dayOfWeek === currentDay);

    const handleAddClass = () => {
        const newClass: ClassSlot = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: '',
            timeStart: '',
            timeEnd: '',
            dayOfWeek: currentDay,
            location: '',
            type: 'Lecture'
        };
        setLocalClasses([...localClasses, newClass]);
    };

    const handleUpdateClass = (id: string, updates: Partial<ClassSlot>) => {
        setLocalClasses(localClasses.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleRemoveClass = (id: string) => {
        setLocalClasses(localClasses.filter(c => c.id !== id));
    };

    const handleSave = () => {
        // Basic validation
        const emptyClasses = localClasses.filter(c => !c.title || !c.timeStart);
        if (emptyClasses.length > 0) {
            Alert.alert('Incomplete entries', 'Some classes are missing title or start time.');
            return;
        }
        setClasses(localClasses);
        Alert.alert('Success', 'Timetable updated successfully!');
        onClose();
    };

    const handleFileUpload = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
            });

            if (!res.canceled) {
                setLoading(true);
                // Simulate AI extraction
                setTimeout(() => {
                    const mockExtracted: ClassSlot[] = [
                        { id: '1', title: 'Data Structures', timeStart: '09:00 AM', timeEnd: '10:00 AM', dayOfWeek: 1, location: 'Room 301', type: 'Lecture' },
                        { id: '2', title: 'Algorithms', timeStart: '10:30 AM', timeEnd: '11:30 AM', dayOfWeek: 1, location: 'Room 302', type: 'Lecture' },
                        { id: '3', title: 'DBMS Lab', timeStart: '02:00 PM', timeEnd: '04:00 PM', dayOfWeek: 2, location: 'Lab 1', type: 'Lab' },
                        { id: '4', title: 'Operating Systems', timeStart: '09:00 AM', timeEnd: '10:00 AM', dayOfWeek: 3, location: 'Room 304', type: 'Lecture' },
                    ];
                    setLocalClasses([...localClasses, ...mockExtracted]);
                    setLoading(false);
                    Alert.alert('AI Extraction Complete', 'We have extracted 4 classes from your timetable file.');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to pick document');
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X color={colors.text} size={24} />
                    </TouchableOpacity>
                    <AppText variant="title">Setup Your Timetable</AppText>
                    <TouchableOpacity onPress={handleSave}>
                        <Save color={colors.primary} size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.uploadSection}>
                    <TouchableOpacity style={styles.uploadBtn} onPress={handleFileUpload} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : (
                            <>
                                <UploadCloud size={24} color={colors.primary} />
                                <AppText color={colors.primary} style={{ marginLeft: spacing.s }}>
                                    Auto-detect via Image/PDF
                                </AppText>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.daySelector}>
                    <TouchableOpacity onPress={() => setCurrentDay((currentDay - 1 + 7) % 7)}>
                        <ChevronLeft color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.currentDayBox}>
                        <Calendar size={18} color={colors.primary} style={{ marginRight: spacing.s }} />
                        <AppText variant="title" color={colors.primary}>{DAYS[currentDay]}</AppText>
                    </View>
                    <TouchableOpacity onPress={() => setCurrentDay((currentDay + 1) % 7)}>
                        <ChevronRight color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.classList} contentContainerStyle={{ paddingBottom: 100 }}>
                    {dayClasses.map((item) => (
                        <Card key={item.id} style={styles.classCard} padding={spacing.m}>
                            <View style={styles.cardHeader}>
                                <AppText variant="caption" color={colors.textSecondary}>Subject Details</AppText>
                                <TouchableOpacity onPress={() => handleRemoveClass(item.id)}>
                                    <Trash2 size={20} color={colors.error} />
                                </TouchableOpacity>
                            </View>

                            <Input
                                label="Subject Title"
                                placeholder="e.g. Mathematics II"
                                value={item.title}
                                onChangeText={(text) => handleUpdateClass(item.id, { title: text })}
                            />

                            <View style={{ flexDirection: 'row', gap: spacing.m }}>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        label="Start Time"
                                        placeholder="09:00 AM"
                                        value={item.timeStart}
                                        onChangeText={(text) => handleUpdateClass(item.id, { timeStart: text })}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        label="Location"
                                        placeholder="Room 101"
                                        value={item.location}
                                        onChangeText={(text) => handleUpdateClass(item.id, { location: text })}
                                    />
                                </View>
                            </View>
                        </Card>
                    ))}

                    <TouchableOpacity style={styles.addClassBtn} onPress={handleAddClass}>
                        <Plus color={colors.primary} size={24} />
                        <AppText color={colors.primary} variant="button" style={{ marginLeft: spacing.s }}>
                            Add Class for {DAYS[currentDay]}
                        </AppText>
                    </TouchableOpacity>

                    {dayClasses.length === 0 && !loading && (
                        <View style={styles.emptyState}>
                            <AppText color={colors.textLight}>No classes scheduled for {DAYS[currentDay]}</AppText>
                        </View>
                    )}

                    <View style={{ marginTop: spacing.xl, marginBottom: 40 }}>
                        <Button
                            title={currentDay < 6 ? `Go to ${DAYS[currentDay + 1]}` : "Finish Setup"}
                            variant="secondary"
                            onPress={() => {
                                if (currentDay < 6) setCurrentDay(currentDay + 1);
                                else handleSave();
                            }}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button title="Save Timetable" onPress={handleSave} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    closeBtn: { padding: spacing.xs },
    uploadSection: {
        padding: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    uploadBtn: {
        height: 60,
        borderRadius: radius.m,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary + '10', // Light primary alpha
    },
    daySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
        backgroundColor: colors.surface,
    },
    currentDayBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '20',
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.s,
        borderRadius: radius.l,
    },
    classList: { flex: 1, padding: spacing.m },
    classCard: { marginBottom: spacing.m },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.s },
    addClassBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.m,
        borderRadius: radius.m,
        backgroundColor: colors.primary + '10',
        marginBottom: spacing.xxl,
    },
    footer: {
        padding: spacing.l,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        bottom: 0,
        position: 'absolute',
        width: '100%',
        backgroundColor: colors.background,
    },
    emptyState: { padding: spacing.xl, alignItems: 'center' },
});
