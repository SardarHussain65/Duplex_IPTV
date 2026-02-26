import { Colors } from '@/constants';
import React from 'react';
import { Text, View } from 'react-native';

export const ComingSoonSection: React.FC = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text style={{ color: Colors.gray[500], fontSize: 16 }}>Coming soon...</Text>
        </View>
    );
};
