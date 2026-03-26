import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { AppText } from './AppText';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    disabled?: boolean;
    loading?: boolean;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    disabled,
    loading,
}: ButtonProps) {
    const getStyles = () => {
        switch (variant) {
            case 'secondary':
                return { bg: colors.card, text: colors.primary, border: colors.card };
            case 'outline':
                return { bg: 'transparent', text: colors.primary, border: colors.border };
            case 'ghost':
                return { bg: 'transparent', text: colors.textSecondary, border: 'transparent' };
            default:
                return { bg: colors.primary, text: colors.textInverse, border: colors.primary };
        }
    };

    const { bg, text, border } = getStyles();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: bg, borderColor: border, borderWidth: 1 },
                disabled && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={text} />
            ) : (
                <AppText variant="button" color={disabled ? colors.textLight : text}>
                    {title}
                </AppText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.s + spacing.xs,
        paddingHorizontal: spacing.l,
        borderRadius: radius.m,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    disabled: {
        opacity: 0.5,
    },
});
