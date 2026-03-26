import React from 'react';
import { View, StyleSheet, ViewProps, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme';

interface ScreenProps extends ViewProps {
    children: React.ReactNode;
    safe?: boolean;
    padding?: boolean;
}

export function Screen({ children, safe = true, padding = true, style, ...props }: ScreenProps) {
    const Container = safe ? SafeAreaView : View;

    return (
        <Container style={[styles.container, style]} {...props}>
            <View style={[styles.inner, padding && { padding: spacing.m }]}>
                {children}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    inner: {
        flex: 1,
    },
});
