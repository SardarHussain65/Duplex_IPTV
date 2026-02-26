import { Colors } from '@/constants';
import { StyleSheet } from 'react-native';

export const panelStyles = StyleSheet.create({
    options: { width: '100%', gap: 12, flexDirection: 'row', flexWrap: 'wrap' },
    card: {
        backgroundColor: Colors.dark[8],
        borderRadius: 16,
        padding: 24,
        gap: 14,
        alignSelf: 'flex-start',
        width: '100%',
    },
    cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray[100] },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        alignItems: 'center',
    },
    rowLabel: { fontSize: 15, color: Colors.dark[4] },
    rowValue: { fontSize: 15, color: Colors.gray[100], fontWeight: '500' },
    divider: { height: 1, backgroundColor: Colors.dark[7], marginVertical: 8 },
    clearBtn: {
        marginTop: 16,
        backgroundColor: Colors.error[500],
        paddingVertical: 14,
        alignSelf: 'stretch',
    },
    languageCard: { width: '48%', height: 80 },
    badge: {
        backgroundColor: Colors.success[500],
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    badgeText: { color: Colors.gray[100], fontSize: 12, fontWeight: '700' },
    tabs: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    playlistCard: { backgroundColor: Colors.dark[8], marginBottom: 12, width: '100%' },
});
