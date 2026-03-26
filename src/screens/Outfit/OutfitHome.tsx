import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useOutfitStore } from '../../store/useOutfitStore';
import { colors, spacing, radius } from '../../theme';
import { Sparkles, Shirt, Plus, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function OutfitHome() {
    const { wardrobe, addItem, removeItem } = useOutfitStore();
    const [suggestion, setSuggestion] = useState<{ t: any, b: any } | null>(null);

    // Add item state
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<'Tops' | 'Bottoms' | 'Shoes' | 'Accessories'>('Tops');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.5 });
        if (!result.canceled) setPhotoUri(result.assets[0].uri);
    };

    const generateOutfit = () => {
        const tops = wardrobe.filter(w => w.category === 'Tops');
        const bottoms = wardrobe.filter(w => w.category === 'Bottoms');
        if (tops.length === 0 || bottoms.length === 0) return;
        const t = tops[Math.floor(Math.random() * tops.length)];
        const b = bottoms[Math.floor(Math.random() * bottoms.length)];
        setSuggestion({ t, b });
    };

    const handleAdd = () => {
        if (!name) return;
        addItem({ name, category, color: photoUri || 'neutral', occasions: ['casual'] }); // Hijacking color prop to store URI for simplicity
        setName(''); setPhotoUri(null); setShowAdd(false);
    };

    return (
        <Screen padding>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <AppText variant="h2" style={styles.header}>Wardrobe</AppText>
                    <TouchableOpacity onPress={() => setShowAdd(!showAdd)}>
                        <Plus color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {showAdd && (
                    <Card elevation="sm" style={styles.formCard}>
                        <AppText variant="title" style={{ marginBottom: spacing.m }}>Add Wardrobe Item</AppText>

                        <TouchableOpacity style={styles.imgPicker} onPress={pickImage}>
                            {photoUri ? <Image source={{ uri: photoUri }} style={{ width: 80, height: 80, borderRadius: 8 }} /> : <View style={{ alignItems: 'center' }}><ImageIcon color={colors.textLight} /><AppText variant="caption">Upload Photo</AppText></View>}
                        </TouchableOpacity>

                        <Input label="Item Name" placeholder="e.g. Navy Blue Blazer" value={name} onChangeText={setName} />
                        <View style={styles.catRow}>
                            {(['Tops', 'Bottoms', 'Shoes'] as const).map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.pill, category === c && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                                    onPress={() => setCategory(c)}
                                >
                                    <AppText color={category === c ? '#fff' : colors.text} variant="body">{c}</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button title="Save Item" onPress={handleAdd} />
                    </Card>
                )}

                <View style={styles.heroContainer}>
                    <Sparkles color={colors.textInverse} size={48} />
                    <AppText variant="title" color={colors.textInverse} style={styles.heroText}>What should I wear?</AppText>
                    <View style={{ marginTop: spacing.l, width: '100%' }}>
                        {wardrobe.filter(w => w.category === 'Tops').length > 0 && wardrobe.filter(w => w.category === 'Bottoms').length > 0 ? (
                            <Button title="Suggest Outfit" onPress={generateOutfit} variant="secondary" />
                        ) : (
                            <Button title="Add Tops and Bottoms first" onPress={() => null} variant="secondary" disabled />
                        )}

                    </View>
                </View>

                {suggestion && (
                    <Card elevation="md" highlightColor={colors.outfit} style={styles.resultCard}>
                        <AppText variant="caption" color={colors.outfit} style={{ marginBottom: spacing.m }}>AI MATCH SUGGESTION</AppText>

                        <View style={{ flexDirection: 'row', gap: spacing.m }}>
                            {suggestion.t.color && suggestion.t.color.startsWith('file:') && <Image source={{ uri: suggestion.t.color }} style={styles.sugImg} />}
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <AppText variant="title">{suggestion.t.name}</AppText>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginVertical: spacing.s }}><Plus color={colors.textLight} size={20} /></View>
                        <View style={{ flexDirection: 'row', gap: spacing.m }}>
                            {suggestion.b.color && suggestion.b.color.startsWith('file:') && <Image source={{ uri: suggestion.b.color }} style={styles.sugImg} />}
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <AppText variant="title">{suggestion.b.name}</AppText>
                            </View>
                        </View>

                    </Card>
                )}

                <View style={styles.wardrobeSection}>
                    <AppText variant="title" style={styles.sectionTitle}>Digital Wardrobe ({wardrobe.length})</AppText>

                    {wardrobe.length === 0 ? (
                        <View style={styles.emptyState}>
                            <AppText color={colors.textSecondary}>Your wardrobe is empty. Add photo items to get suggestions.</AppText>
                            <Button title="Add First Item" onPress={() => setShowAdd(true)} variant="outline" />
                        </View>
                    ) : (
                        wardrobe.map(w => (
                            <Card key={w.id} style={styles.itemCard} padding={spacing.m}>
                                {w.color.startsWith('file:') ? (
                                    <Image source={{ uri: w.color }} style={{ width: 40, height: 40, borderRadius: 8, marginRight: spacing.s }} />
                                ) : (
                                    <Shirt color={colors.outfit} size={20} style={{ marginRight: spacing.s }} />
                                )}
                                <View style={{ flex: 1 }}>
                                    <AppText variant="body">{w.name}</AppText>
                                    <AppText variant="caption" color={colors.textSecondary}>{w.category}</AppText>
                                </View>
                                <TouchableOpacity onPress={() => removeItem(w.id)}>
                                    <AppText variant="caption" color={colors.error}>Delete</AppText>
                                </TouchableOpacity>
                            </Card>
                        ))
                    )}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.l },
    header: { color: colors.text },
    formCard: { marginBottom: spacing.l },
    catRow: { flexDirection: 'row', gap: spacing.s, marginBottom: spacing.m },
    pill: { paddingHorizontal: spacing.m, paddingVertical: spacing.xs, borderRadius: radius.round, backgroundColor: colors.border, borderWidth: 1, borderColor: colors.border },
    imgPicker: { width: 80, height: 80, borderRadius: 8, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.m },
    heroContainer: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.outfit, borderRadius: radius.l, marginBottom: spacing.l },
    heroText: { marginTop: spacing.m },
    sugImg: { width: 60, height: 60, borderRadius: 8 },
    resultCard: { padding: spacing.l, marginBottom: spacing.l },
    wardrobeSection: { marginTop: spacing.m },
    sectionTitle: { marginBottom: spacing.m },
    itemCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.s },
    emptyState: { alignItems: 'center', gap: spacing.m, padding: spacing.l },
});
