import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useTasksStore, AppTask } from '../../store/useTasksStore';
import { colors, spacing, radius } from '../../theme';
import { Plus, CheckCircle2, Circle } from 'lucide-react-native';

export default function RemindersHome() {
    const { tasks, addTask, toggleTask, removeTask } = useTasksStore();
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const pending = tasks.filter(t => !t.completed);
    const done = tasks.filter(t => t.completed);

    const handleAdd = () => {
        if (!title) return;
        addTask({
            title,
            priority,
            dueDate: new Date().toISOString(),
            category: 'General',
        });
        setTitle('');
        setShowAdd(false);
    };

    const priorityColor = (p: string) => {
        if (p === 'high') return colors.error;
        if (p === 'medium') return colors.warning;
        return colors.info;
    };

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <AppText variant="h2">Tasks & Reminders</AppText>
                    <TouchableOpacity onPress={() => setShowAdd(!showAdd)}>
                        <Plus color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {showAdd && (
                    <Card elevation="sm" style={styles.formCard}>
                        <AppText variant="title">New Task</AppText>
                        <Input label="Title" placeholder="What do you need to do?" value={title} onChangeText={setTitle} />
                        <View style={styles.priorityRow}>
                            {['low', 'medium', 'high'].map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.pPill, priority === p && { backgroundColor: priorityColor(p) }]}
                                    onPress={() => setPriority(p as any)}
                                >
                                    <AppText color={priority === p ? '#fff' : colors.text} variant="caption">
                                        {p.toUpperCase()}
                                    </AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button title="Add Task" onPress={handleAdd} />
                    </Card>
                )}

                <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                    UPCOMING & DUE ({pending.length})
                </AppText>

                {pending.length === 0 && !showAdd && (
                    <View style={styles.emptyState}>
                        <AppText color={colors.textLight}>All caught up! 🎉</AppText>
                    </View>
                )}

                {pending.map(task => (
                    <Card key={task.id} style={styles.taskCard} highlightColor={priorityColor(task.priority)}>
                        <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkBtn}>
                            <Circle color={colors.textLight} size={24} />
                        </TouchableOpacity>
                        <View style={styles.taskDetails}>
                            <AppText variant="button">{task.title}</AppText>
                        </View>
                    </Card>
                ))}

                {done.length > 0 && (
                    <View style={{ marginTop: spacing.l }}>
                        <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                            COMPLETED
                        </AppText>
                        {done.map(task => (
                            <Card key={task.id} style={[styles.taskCard, styles.taskDone]}>
                                <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkBtn}>
                                    <CheckCircle2 color={colors.success} size={24} />
                                </TouchableOpacity>
                                <View style={styles.taskDetails}>
                                    <AppText variant="button" color={colors.textLight} style={{ textDecorationLine: 'line-through' }}>
                                        {task.title}
                                    </AppText>
                                </View>
                                <TouchableOpacity onPress={() => removeTask(task.id)}>
                                    <AppText variant="caption" color={colors.error}>Delete</AppText>
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    formCard: {
        marginBottom: spacing.l,
        gap: spacing.m,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: spacing.s,
        marginBottom: spacing.m,
    },
    pPill: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: radius.round,
        backgroundColor: colors.border,
    },
    sectionTitle: {
        letterSpacing: 1,
        marginBottom: spacing.m,
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.s,
        padding: spacing.m,
    },
    taskDone: {
        opacity: 0.6,
    },
    checkBtn: {
        marginRight: spacing.m,
    },
    taskDetails: {
        flex: 1,
    },
});
