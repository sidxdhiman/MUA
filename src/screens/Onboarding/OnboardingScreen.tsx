import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing, radius } from '../../theme';
import { useAppStore, UserProfile, ModulePreferences } from '../../store/useAppStore';
import { Check, Camera, BellRing, MapPin, Sparkles } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function OnboardingScreen() {
    const completeOnboarding = useAppStore((state) => state.completeOnboarding);
    const [step, setStep] = useState(1);

    // Profile Data
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    // Permissions State
    const [permsGranted, setPermsGranted] = useState(false);

    // Modules
    const [modules, setModules] = useState<ModulePreferences>({
        finance: true, health: true, reminders: true, outfit: true, voiceNotes: true, attendance: true, diet: true
    });

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.5 });
        if (!result.canceled) setAvatar(result.assets[0].uri);
    };

    const requestPermissions = async () => {
        await Location.requestForegroundPermissionsAsync();
        await Notifications.requestPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermsGranted(true);
        setStep(4); // Advance
    };

    const handleFinish = () => {
        completeOnboarding({
            name: name.trim() || 'Beautiful Soul',
            role: 'professional',
            routineType: 'balanced',
            wakeUpTime: '07:30 AM', sleepTime: '11:00 PM', quietHoursStart: '22:00', quietHoursEnd: '07:00'
        }, modules);
    };

    return (
        <Screen padding>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {step === 1 && (
                    <View style={styles.stepCenter}>
                        <Sparkles size={64} color={colors.primary} />
                        <AppText variant="h1" style={styles.titleCenter}>Welcome to your new daily life.</AppText>
                        <AppText variant="body" color={colors.textSecondary} style={styles.subtitleCenter}>
                            DayStack is a lovingly crafted assistant that adapts entirely to you. Ready to make your life wonderfully simple?
                        </AppText>
                        <Button title="I'm ready" onPress={() => setStep(2)} />
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.step}>
                        <AppText variant="h2" style={styles.title}>Let's get personal 💫</AppText>
                        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                            How would you like to be greeted every day?
                        </AppText>

                        <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
                            {avatar ? (
                                <Image source={{ uri: avatar }} style={styles.avatarImg} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Camera color={colors.textLight} size={32} />
                                    <AppText variant="caption" color={colors.textSecondary}>Add Photo</AppText>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Input
                            label="Your Name or Nickname"
                            placeholder="e.g. Alex"
                            value={name}
                            onChangeText={setName}
                        />

                        <View style={styles.footer}>
                            <Button title="Continue" onPress={() => setStep(3)} disabled={!name.trim()} />
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.step}>
                        <AppText variant="h2" style={styles.title}>Granting superpowers</AppText>
                        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                            To make the magic happen, DayStack needs a few core permissions up front. We promise to use them thoughtfully.
                        </AppText>

                        <View style={styles.permCard}>
                            <BellRing color={colors.primary} size={24} style={{ marginRight: spacing.m }} />
                            <View style={{ flex: 1 }}>
                                <AppText variant="button">Notifications</AppText>
                                <AppText variant="caption" color={colors.textSecondary}>Reminders & summaries</AppText>
                            </View>
                        </View>
                        <View style={styles.permCard}>
                            <MapPin color={colors.primary} size={24} style={{ marginRight: spacing.m }} />
                            <View style={{ flex: 1 }}>
                                <AppText variant="button">Location</AppText>
                                <AppText variant="caption" color={colors.textSecondary}>For smart class attendance</AppText>
                            </View>
                        </View>
                        <View style={styles.permCard}>
                            <Camera color={colors.primary} size={24} style={{ marginRight: spacing.m }} />
                            <View style={{ flex: 1 }}>
                                <AppText variant="button">Photos</AppText>
                                <AppText variant="caption" color={colors.textSecondary}>For smart wardrobe matching</AppText>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <Button title="Allow Permissions" onPress={requestPermissions} />
                        </View>
                    </View>
                )}

                {step === 4 && (
                    <View style={styles.stepCenter}>
                        <AppText variant="h2" style={styles.titleCenter}>All set, {name}!</AppText>
                        <AppText variant="body" color={colors.textSecondary} style={styles.subtitleCenter}>
                            Your personal assistant is ready. We've unlocked all features to begin with, but you can turn them off inside settings at any time!
                        </AppText>
                        <Button title="Open My Dashboard" onPress={handleFinish} />
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, paddingVertical: spacing.l },
    step: { flex: 1 },
    stepCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
    title: { marginBottom: spacing.m },
    titleCenter: { marginBottom: spacing.m, textAlign: 'center', marginTop: spacing.m },
    subtitle: { marginBottom: spacing.xl },
    subtitleCenter: { marginBottom: spacing.xl, textAlign: 'center' },
    avatarPicker: { alignSelf: 'center', marginBottom: spacing.xl },
    avatarImg: { width: 120, height: 120, borderRadius: 60 },
    avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
    permCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: spacing.m, borderRadius: radius.m, marginBottom: spacing.s },
    footer: { marginTop: spacing.xl, paddingBottom: spacing.xl },
});
