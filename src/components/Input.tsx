import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { AppText } from './AppText';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
    return (
        <View style={styles.container}>
            {label && (
                <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
                    {label}
                </AppText>
            )}
            <TextInput
                style={[
                    styles.input,
                    error && styles.errorInput,
                    style,
                ]}
                placeholderTextColor={colors.textLight}
                {...props}
            />
            {error && (
                <AppText variant="caption" color={colors.error} style={styles.errorText}>
                    {error}
                </AppText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
    },
    label: {
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: radius.m,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        minHeight: 48,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    errorInput: {
        borderColor: colors.error,
    },
    errorText: {
        marginTop: spacing.xs,
    },
});
