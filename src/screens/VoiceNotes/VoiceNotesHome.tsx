import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { useVoiceNotesStore } from '../../store/useVoiceNotesStore';
import { colors, spacing, radius } from '../../theme';
import { Mic, Search, Play, Pause, Trash2, StopCircle } from 'lucide-react-native';
import { Audio } from 'expo-av';

export default function VoiceNotesHome() {
    const { notes, addNote, removeNote } = useVoiceNotesStore();
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [query, setQuery] = useState('');

    const [playingId, setPlayingId] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const startRecording = async () => {
        try {
            const perf = await Audio.requestPermissionsAsync();
            if (perf.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                setIsRecording(true);
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        try {
            if (!recording) return;
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                const randStr = Math.random().toString(36).substring(7);
                addNote({
                    title: `Audio Note ${randStr}`,
                    transcript: "(Auto-transcription simulated for raw audio capture.)",
                    date: new Date().toLocaleDateString(),
                    tags: ['audio'],
                    uri
                });
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const handleRecordToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const playSound = async (noteUri: string, id: string) => {
        if (playingId === id) {
            // Stop current
            sound?.stopAsync();
            setPlayingId(null);
            return;
        }

        if (sound) {
            await sound.unloadAsync();
        }

        try {
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: noteUri });
            setSound(newSound);
            setPlayingId(id);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.didJustFinish) {
                    setPlayingId(null);
                }
            });

            await newSound.playAsync();
        } catch (err) {
            console.log("Cannot play audio:", err);
        }
    };

    const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.transcript.toLowerCase().includes(query.toLowerCase()));

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
                <AppText variant="h2" style={styles.header}>Voice Notes</AppText>

                <View style={styles.searchWrap}>
                    <View style={styles.searchBar}>
                        <Search color={colors.textSecondary} size={20} />
                        <Input
                            placeholder="Search transcripts..."
                            value={query}
                            onChangeText={setQuery}
                            style={{ borderBottomWidth: 0, paddingLeft: 10, flex: 1 }}
                        />
                    </View>
                </View>

                <View style={styles.recordSection}>
                    <TouchableOpacity
                        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                        onPress={handleRecordToggle}
                        activeOpacity={0.8}
                    >
                        {isRecording ? <StopCircle color="#fff" size={32} /> : <Mic color="#fff" size={32} />}
                    </TouchableOpacity>
                    <AppText variant="title" style={{ marginTop: spacing.m }}>
                        {isRecording ? 'Recording Audio...' : 'Tap to Record'}
                    </AppText>
                    {isRecording && <AppText variant="caption" color={colors.textSecondary}>Listening to the microphone stream.</AppText>}
                </View>

                <View style={styles.notesList}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m }}>
                        <AppText variant="title">Recent Clips ({notes.length})</AppText>
                    </View>

                    {notes.length === 0 ? (
                        <View style={styles.emptyState}>
                            <AppText color={colors.textLight} style={{ textAlign: 'center' }}>Record a voice note and DayStack will securely capture and store the audio locally.</AppText>
                        </View>
                    ) : (
                        filteredNotes.map((note) => (
                            <Card key={note.id} style={styles.noteCard} highlightColor={playingId === note.id ? colors.voice : undefined}>
                                <View style={styles.noteHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={[styles.playBtn, playingId === note.id && { backgroundColor: colors.voice }]}
                                            onPress={() => note.uri && playSound(note.uri, note.id)}
                                        >
                                            {playingId === note.id ? <Pause color="#fff" size={16} /> : <Play color={colors.voice} size={16} />}
                                        </TouchableOpacity>
                                        <View style={{ marginLeft: spacing.s }}>
                                            <AppText variant="button">{note.title}</AppText>
                                            <AppText variant="caption" color={colors.textLight}>{note.date}</AppText>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => removeNote(note.id)}>
                                        <Trash2 color={colors.error} size={18} />
                                    </TouchableOpacity>
                                </View>
                                <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.m }}>
                                    "{note.transcript}"
                                </AppText>
                            </Card>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: { marginBottom: spacing.l, color: colors.text },
    searchWrap: { backgroundColor: colors.background, paddingBottom: spacing.l },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
        borderRadius: radius.m, paddingHorizontal: spacing.m, borderWidth: 1, borderColor: colors.border,
    },
    recordSection: { alignItems: 'center', paddingVertical: spacing.xxl, marginBottom: spacing.l },
    recordButton: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: colors.voice,
        justifyContent: 'center', alignItems: 'center', elevation: 4,
    },
    recordButtonActive: { backgroundColor: colors.error },
    notesList: { marginTop: spacing.m },
    noteCard: { marginBottom: spacing.s, padding: spacing.m },
    noteHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.voice + '20', justifyContent: 'center', alignItems: 'center' },
    emptyState: { alignItems: 'center', padding: spacing.xl },
});
