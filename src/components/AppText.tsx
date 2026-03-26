import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export interface AppTextProps extends TextProps {
    variant?: keyof typeof typography;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function AppText({
    variant = 'body',
    color = colors.text,
    align = 'left',
    style,
    children,
    ...props
}: AppTextProps) {
    const textStyle = typography[variant];

    return (
        <RNText
            style={[
                textStyle,
                { color, textAlign: align },
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
}
