import { CardExamples } from '@/components/ui/CardExamples'
import { Colors } from '@/constants'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const test = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.dark[1] }}>
            <CardExamples />
        </View>
    )
}

export default test

const styles = StyleSheet.create({})