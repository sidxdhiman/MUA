import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AppText } from './AppText';
import { Button } from './Button';
import { colors, spacing, radius } from '../theme';
import { X, Search, Crosshair, MapPin } from 'lucide-react-native';

interface MapPickerProps {
    visible: boolean;
    onClose: () => void;
    onLocationSelect: (coords: { lat: number, lon: number }) => void;
    initialLocation?: { lat: number, lon: number } | null;
}

export function MapPicker({ visible, onClose, onLocationSelect, initialLocation }: MapPickerProps) {
    const [region, setRegion] = useState({
        latitude: initialLocation?.lat || 37.78825,
        longitude: initialLocation?.lon || -122.4324,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lon: number } | null>(initialLocation || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted' && !initialLocation) {
                    let location = await Location.getCurrentPositionAsync({});
                    const newRegion = {
                        ...region,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    };
                    setRegion(newRegion);
                    setSelectedLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
                }
            })();
        }
    }, [visible]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const results = await Location.geocodeAsync(searchQuery);
            if (results.length > 0) {
                const { latitude, longitude } = results[0];
                const newRegion = {
                    ...region,
                    latitude,
                    longitude,
                };
                setRegion(newRegion);
                setSelectedLocation({ lat: latitude, lon: longitude });
            } else {
                Alert.alert('No results', 'Location not found');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to search location');
        } finally {
            setLoading(false);
        }
    };

    const handleGetCurrentLocation = async () => {
        setLoading(true);
        try {
            let location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setRegion(newRegion);
            setSelectedLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
        } catch (error) {
            Alert.alert('Error', 'Failed to get current location');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X color={colors.text} size={24} />
                    </TouchableOpacity>
                    <AppText variant="title">Select Campus Location</AppText>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search location..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            placeholderTextColor={colors.textLight}
                        />
                        {loading && <ActivityIndicator size="small" color={colors.primary} />}
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region}
                        onRegionChangeComplete={setRegion}
                        onPress={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setSelectedLocation({
                                lat: latitude,
                                lon: longitude
                            });
                        }}
                    >
                        {selectedLocation && (
                            <Marker
                                coordinate={{
                                    latitude: selectedLocation.lat,
                                    longitude: selectedLocation.lon
                                }}
                                title="Selected Location"
                            />
                        )}
                    </MapView>

                    <TouchableOpacity style={styles.fab} onPress={handleGetCurrentLocation}>
                        <Crosshair color={colors.white} size={24} />
                    </TouchableOpacity>

                    <View style={styles.centerMarker}>
                        {!selectedLocation && <MapPin color={colors.primary} size={32} />}
                    </View>
                </View>

                <View style={styles.footer}>
                    <AppText variant="caption" style={{ marginBottom: spacing.m }}>
                        Tap on the map or search to select your campus.
                    </AppText>
                    <Button
                        title="Confirm Location"
                        onPress={handleConfirm}
                        disabled={!selectedLocation}
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
    mapContainer: { flex: 1, position: 'relative' },
    map: { ...StyleSheet.absoluteFillObject },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -32,
        marginLeft: -16,
        pointerEvents: 'none',
    },
    footer: {
        padding: spacing.l,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    }
});
