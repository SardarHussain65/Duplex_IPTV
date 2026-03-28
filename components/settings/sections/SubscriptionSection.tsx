import { Colors } from '@/constants';
import { useTab } from '@/context/TabContext';
import { panelStyles } from '@/styles/settings_panel.styles';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, findNodeHandle, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/lib/api/hooks/useSubscription';

interface SubscriptionSectionProps {
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
}

interface SubscriptionRowProps {
    label: string;
    val: string;
    index: number;
    startRef: React.RefObject<any>;
    sidebarRef: React.RefObject<any>;
    settingsTabNode: number | null;
    isError?: boolean;
}

const SubscriptionRow: React.FC<SubscriptionRowProps> = ({
    label,
    val,
    index,
    startRef,
    sidebarRef,
    settingsTabNode,
    isError,
}) => {
    const rowRef = useRef<any>(null);
    const [handle, setHandle] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (rowRef.current) {
            setHandle(findNodeHandle(rowRef.current) || undefined);
        }
    }, [rowRef.current]);

    return (
        <View
            key={label}
            ref={(node) => {
                rowRef.current = node;
                if (index === 0) {
                    if (typeof startRef === 'function') (startRef as any)(node);
                    else if (startRef) (startRef as any).current = node;
                }
            }}
            style={panelStyles.row}
            nativeID={index === 0 ? "settings_content_start" : undefined}
            nextFocusLeft={index === 0 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
            nextFocusRight={handle}
            nextFocusUp={index === 0 ? (settingsTabNode || undefined) : undefined}
            nextFocusDown={index === 1 ? findNodeHandle(sidebarRef.current) || undefined : undefined}
            focusable={true}
        >
            <Text style={panelStyles.rowLabel}>{label}</Text>
            <Text style={[panelStyles.rowValue, isError && { color: Colors.error[500] }]}>{val}</Text>
        </View>
    );
};

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ startRef, sidebarRef }) => {
    const { t } = useTranslation();
    const { settingsTabNode } = useTab();
    const { subscription, loading, error } = useSubscription();

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysRemaining = (endDate: string | undefined) => {
        if (!endDate) return 0;
        const diff = new Date(endDate).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    if (loading) {
        return (
            <View style={[panelStyles.card, { height: 150, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
                <Text style={[panelStyles.rowLabel, { marginTop: 12 }]}>{t('common.loading') || 'Loading...'}</Text>
            </View>
        );
    }

    if (error || !subscription) {
        return (
            <View style={[panelStyles.card, { height: 150, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={panelStyles.rowLabel}>{t('common.error') || 'Error loading subscription data'}</Text>
            </View>
        );
    }

    const daysRemaining = getDaysRemaining(subscription.endDate);
    const planName = subscription.plan?.name || t('settings.subscriptionOptions.monthlyPlan');
    const statusLabel = subscription.status || t('settings.subscriptionOptions.active');

    const infoRows = [
        { label: t('settings.subscriptionOptions.expires'), value: formatDate(subscription.endDate), isError: false },
        { label: t('settings.subscriptionOptions.daysRemaining'), value: t('settings.subscriptionOptions.days', { count: daysRemaining }), isError: daysRemaining < 7 },
    ];

    return (
        <View style={panelStyles.card}>
            <View style={[panelStyles.row, { justifyContent: 'flex-start', alignItems: 'center', gap: 12 }]}>
                <Text style={panelStyles.cardTitle}>{planName}</Text>
                <View style={panelStyles.badge}>
                    <Text style={panelStyles.badgeText}>{statusLabel}</Text>
                </View>
            </View>
            <View style={panelStyles.divider} />
            {infoRows.map((row, index) => (
                <SubscriptionRow
                    key={row.label}
                    label={row.label}
                    val={row.value}
                    index={index}
                    startRef={startRef}
                    sidebarRef={sidebarRef}
                    settingsTabNode={settingsTabNode}
                    isError={row.isError}
                />
            ))}
        </View>
    );
};
