import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { colors, spacing, radius } from '../theme';
import { X, Search, MapPin } from 'lucide-react-native';

interface MapPickerProps {
    visible: boolean;
    onClose: () => void;
    onLocationSelect: (coords: { lat: number, lon: number }) => void;
    initialLocation?: { lat: number, lon: number } | null;
}

export function MapPicker({ visible, onClose, onLocationSelect, initialLocation }: MapPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleConfirmMock = () => {
        // Mock a location for web testing
        onLocationSelect({ lat: 28.6139, lon: 77.2090 });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X color={colors.text} size={24} />
                    </TouchableOpacity>
                    <AppText variant="title">Select Campus Location (Web Demo)</AppText>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Map not available on web, type demo..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={colors.textLight}
                        />
                    </View>
                </View>

                <View style={styles.mapMock}>
                    <MapPin color={colors.primary} size={64} />
                    <AppText variant="title">Interactive Map is Native-Only</AppText>
                    <AppText color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.s }}>
                        For full map features with search and GPS, please run on Android or iOS.
                    </AppText>
                    <AppText color={colors.primaryLight} style={{ marginTop: spacing.l }}>
                        Current Mock: Delhi, IN
                    </AppText>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Confirm Mock Location"
                        onPress={handleConfirmMock}
                    />
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
    searchContainer: {
        padding: spacing.m,
        backgroundColor: colors.background,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.m,
        paddingHorizontal: spacing.m,
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.m,
        color: colors.text,
        fontSize: 16,
    },
    mapMock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.divider,
    },
    footer: {
        padding: spacing.l,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    }
});
