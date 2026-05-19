import { Colors } from '@/constants';
import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export const ComingSoonSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text style={{ color: Colors.gray[500], fontSize: 16 }}>{t('common.comingSoon')}</Text>
        </View>
    );
};
