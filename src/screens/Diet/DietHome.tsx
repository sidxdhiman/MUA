import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useDietStore } from '../../store/useDietStore';
import { colors, spacing, radius } from '../../theme';
import { Apple, Clock, Bell, Plus, CheckCircle2, Target } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DietHome() {
    const { meals, addMeal, removeMeal, toggleCompletion } = useDietStore();
    const [showAdd, setShowAdd] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(meals.length === 0);

    const [title, setTitle] = useState('');
    const [mealName, setMealName] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const [prepInfo, setPrepInfo] = useState('');

    const [goal, setGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintenance'>('Maintenance');

    const todayStr = new Date().toISOString().split('T')[0];

    const handleAdd = () => {
        if (!title || !mealName) return;
        addMeal({
            title,
            meal: mealName,
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            prepInfo,
            date: todayStr
        });
        setTitle(''); setMealName(''); setPrepInfo('');
        setShowAdd(false);
    };

    const handleSuggest = () => {
        let recs: string[] = [];
        if (goal === 'Weight Loss') recs = ['Oats & Berries', 'Grilled Chicken Salad', 'Steamed Fish & Veggies'];
        if (goal === 'Muscle Gain') recs = ['Eggs & Toast', 'Chicken Pasta', 'Beef & Rice'];
        if (goal === 'Maintenance') recs = ['Yogurt Parfait', 'Turkey Sandwich', 'Stir Fry'];

        addMeal({ title: 'Breakfast', meal: recs[0], time: '08:00 AM', prepInfo: 'Quick prep', date: todayStr });
        addMeal({ title: 'Lunch', meal: recs[1], time: '01:00 PM', prepInfo: 'Reheat needed', date: todayStr });
        addMeal({ title: 'Dinner', meal: recs[2], time: '08:00 PM', prepInfo: 'Cook fresh', date: todayStr });
        setShowOnboarding(false);
    };

    const upcomingMeals = meals.filter(m => !m.completed).sort((a, b) => a.time.localeCompare(b.time));
    const completedMeals = meals.filter(m => m.completed);

    if (showOnboarding) {
        return (
            <Screen padding>
                <View style={styles.onboardCenter}>
                    <Target size={64} color={colors.diet} />
                    <AppText variant="h2" style={{ marginVertical: spacing.m, textAlign: 'center' }}>Welcome to Meals</AppText>
                    <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                        Let's set up a quick rhythm. What is your primary physiological goal right now?
                    </AppText>

                    {(['Weight Loss', 'Muscle Gain', 'Maintenance'] as const).map(g => (
                        <TouchableOpacity
                            key={g}
                            onPress={() => setGoal(g)}
                            style={[styles.goalPill, goal === g && { backgroundColor: colors.diet, borderColor: colors.diet }]}
                        >
                            <AppText color={goal === g ? '#fff' : colors.text}>{g}</AppText>
                        </TouchableOpacity>
                    ))}

                    <View style={{ marginTop: spacing.xl }}>
                        <Button title="Generate My Plan automatically" onPress={handleSuggest} />
                    </View>
                    <Button title="Or Skip to Plan Manually" onPress={() => setShowOnboarding(false)} variant="ghost" />
                </View>
            </Screen>
        );
    }

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <AppText variant="h2" style={styles.header}>Diet & Meal Planner</AppText>
                    <TouchableOpacity onPress={() => setShowAdd(!showAdd)}>
                        <Plus color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {showAdd && (
                    <Card elevation="sm" style={styles.formCard}>
                        <AppText variant="title" style={{ marginBottom: spacing.m }}>Plan a Meal</AppText>
                        <Input label="Meal Slot (E.g. Breakfast)" placeholder="Lunch" value={title} onChangeText={setTitle} />
                        <Input label="Food" placeholder="Chicken Salad" value={mealName} onChangeText={setMealName} />

                        <AppText variant="caption" color={colors.textSecondary} style={{ marginBottom: 4 }}>Scheduled Time</AppText>
                        <TouchableOpacity style={styles.timeBtn} onPress={() => setShowTime(true)}>
                            <AppText>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</AppText>
                        </TouchableOpacity>

                        {showTime && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={(evt: any, selDate: any) => { setShowTime(false); if (selDate) setTime(selDate); }}
                            />
                        )}

                        <Input label="Prep Requirement" placeholder="Defrost chicken 2hrs early" value={prepInfo} onChangeText={setPrepInfo} />
                        <Button title="Schedule Meal" onPress={handleAdd} />
                    </Card>
                )}

                <AppText variant="title" style={styles.sectionTitle}>
                    Today's Plan ({upcomingMeals.length})
                </AppText>

                {upcomingMeals.length === 0 ? (
                    <View style={{ padding: spacing.xl, alignItems: 'center' }}>
                        <AppText color={colors.textLight} style={{ textAlign: 'center', marginBottom: spacing.m }}>
                            Your diet plan is empty. Schedule your meals to start receiving early preparation alerts.
                        </AppText>
                    </View>
                ) : (
                    upcomingMeals.map((m) => (
                        <Card key={m.id} style={styles.mealCard} highlightColor={colors.diet}>
                            <View style={styles.mealHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Apple color={colors.diet} size={16} />
                                    <AppText variant="button" style={{ marginLeft: spacing.xs }}>{m.title}</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Clock color={colors.textSecondary} size={14} />
                                    <AppText variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>{m.time}</AppText>
                                </View>
                            </View>
                            <AppText variant="h3" style={{ marginTop: spacing.xs, marginBottom: spacing.xs }}>{m.meal}</AppText>
                            {m.prepInfo ? <AppText variant="caption" color={colors.textSecondary}>Prep Note: {m.prepInfo}</AppText> : null}
                            <View style={{ marginTop: spacing.m, flexDirection: 'row', gap: spacing.m }}>
                                <Button title="Completed" variant="outline" onPress={() => toggleCompletion(m.id)} />
                                <TouchableOpacity onPress={() => removeMeal(m.id)} style={{ justifyContent: 'center', marginLeft: 'auto' }}>
                                    <AppText color={colors.error} variant="caption">Delete</AppText>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))
                )}

                {completedMeals.length > 0 && (
                    <View style={{ marginTop: spacing.xl }}>
                        <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>COMPLETED ({completedMeals.length})</AppText>
                        {completedMeals.map(m => (
                            <Card key={m.id} style={[styles.mealCard, { opacity: 0.6 }]}>
                                <View style={styles.mealHeader}>
                                    <AppText variant="button" style={{ textDecorationLine: 'line-through' }}>{m.title}</AppText>
                                    <TouchableOpacity onPress={() => toggleCompletion(m.id)}>
                                        <CheckCircle2 color={colors.success} size={20} />
                                    </TouchableOpacity>
                                </View>
                                <AppText variant="body" color={colors.textSecondary}>{m.meal}</AppText>
                            </Card>
                        ))}
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    onboardCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    goalPill: { width: '100%', padding: spacing.m, borderRadius: radius.m, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.m, alignItems: 'center' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.l },
    header: { color: colors.text },
    formCard: { marginBottom: spacing.l },
    timeBtn: { padding: spacing.m, backgroundColor: colors.background, borderRadius: radius.m, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.m },
    sectionTitle: { marginBottom: spacing.m },
    mealCard: { padding: spacing.m, marginBottom: spacing.m },
    mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
