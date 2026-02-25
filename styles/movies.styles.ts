import { Colors } from '@/constants';
import { scale, xdHeight, xdWidth } from '@/constants/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141416',
    },
    content: {
        paddingBottom: xdHeight(40),
    },
    headerContainer: {
        marginBottom: xdHeight(16),
    },

    // Hero
    heroContainer: {
        height: xdHeight(380),
        position: 'relative',
        justifyContent: 'flex-end',
        marginBottom: xdHeight(28),
    },
    heroBg: {
        ...StyleSheet.absoluteFillObject,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        paddingHorizontal: xdWidth(40),
        paddingBottom: xdHeight(50),
    },
    heroMeta: {
        fontSize: scale(13),
        color: Colors.gray[400],
        fontWeight: '500',
        marginBottom: xdHeight(8),
    },
    heroTitle: {
        fontSize: scale(36),
        fontWeight: '800',
        color: Colors.gray[100],
        marginBottom: xdHeight(10),
        letterSpacing: -0.5,
    },
    heroDesc: {
        fontSize: scale(13),
        color: Colors.gray[400],
        lineHeight: scale(20),
        maxWidth: xdWidth(420),
        marginBottom: xdHeight(22),
    },
    heroBtns: {
        flexDirection: 'row',
        gap: xdWidth(14),
    },

    // Carousel dots
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: xdWidth(8),
        paddingBottom: xdHeight(16),
    },
    dot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
    },

    // Search
    searchWrapper: {
        paddingHorizontal: xdWidth(32),
        marginBottom: xdHeight(24),
    },

    // Categories
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: '700',
        color: Colors.gray[100],
        marginBottom: xdHeight(14),
        paddingHorizontal: xdWidth(32),
    },
    categoryRow: {
        marginBottom: xdHeight(20),
    },
    categoryContent: {
        paddingHorizontal: xdWidth(32),
    },

    // Grid
    gridContainer: {
        paddingHorizontal: xdWidth(32),
    },
    columnWrapper: {
        gap: xdWidth(20),
    },
    cardSpacing: {
        marginBottom: xdHeight(16),
    },
});
