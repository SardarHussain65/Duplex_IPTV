/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Preview Card Component
 * ─────────────────────────────────────────────────────────────
 */

import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface PreviewCardProps {
    title: string;
    logo?: string;
    channelName?: string;
    isLoading?: boolean;
    style?: ViewStyle;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
    title,
    logo,
    channelName,
    isLoading = false,
    style,
}) => {
    return (
        <View style={[styles.previewCard, style]}>

            {/* Image fills the entire card */}
            {logo ? (
                <Image
                    source={{ uri: logo }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
            ) : (
                <View style={styles.logoPlaceholder} />
            )}

            {/* Title overlays on top of the image */}
            <Text style={styles.previewShowTitle} numberOfLines={1}>
                {title}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    previewCard: {
        width: xdWidth(390),
        height: xdHeight(220),
        backgroundColor: '#7E7E7E',
        borderRadius: scale(18),
        overflow: 'hidden',     // clips image + rounds corners — NO padding
    },
    previewShowTitle: {
        fontSize: scale(13),
        fontWeight: '600',
        color: Colors.gray[100],
        position: 'absolute',   // floats over the image
        top: xdHeight(16),
        left: xdWidth(16),
        right: xdWidth(16),
    },
    logoPlaceholder: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});