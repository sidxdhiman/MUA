import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, shadows } from '../theme';

interface CardProps extends ViewProps {
    children: React.ReactNode;
    onPress?: () => void;
    padding?: number;
    highlightColor?: string;
    elevation?: 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    onPress,
    padding = spacing.m,
    highlightColor,
    elevation = 'sm',
    style,
    ...props
}: CardProps) {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[
                styles.card,
                shadows[elevation],
                { padding },
                highlightColor && { borderLeftWidth: 4, borderLeftColor: highlightColor },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            {...props as any}
        >
            {children}
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: radius.m,
        marginBottom: spacing.m,
    },
});
