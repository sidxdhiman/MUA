import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { AppText } from './AppText';
import { colors, spacing, radius } from '../theme';
import { ChevronRight } from 'lucide-react-native';

interface SummaryCardProps {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    onPress?: () => void;
    accentColor?: string;
    rightAction?: React.ReactNode;
}

export function SummaryCard({
    title,
    subtitle,
    icon,
    content,
    onPress,
    accentColor = colors.primary,
    rightAction,
}: SummaryCardProps) {
    return (
        <Card elevation="sm" highlightColor={accentColor} onPress={onPress}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
                        {icon}
                    </View>
                    <View style={styles.titleText}>
                        <AppText variant="title">{title}</AppText>
                        {subtitle && (
                            <AppText variant="caption" color={colors.textSecondary}>{subtitle}</AppText>
                        )}
                    </View>
                </View>
                <View style={styles.actionRow}>
                    {rightAction ? rightAction : (onPress && <ChevronRight color={colors.textLight} size={20} />)}
                </View>
            </View>
            <View style={styles.content}>{content}</View>
        </Card>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: radius.round,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.s,
    },
    titleText: {
        flex: 1,
    },
    actionRow: {
        paddingLeft: spacing.s,
    },
    content: {
        // any default padding or layout for content
    },
});
