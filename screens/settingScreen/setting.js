import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function setting({navigation}) {
    return (
        <View style={{ padding: 10 }}>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 10 }} onPress={() => navigation.navigate("EditFinance")}>
                <Text style={styles.buttonTitle}>Edit Finance Data</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20 }} onPress={() => navigation.navigate("Reset")}>
                <Text style={styles.buttonTitle}>Reset Data</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonTitle : {
        fontWeight: '700', fontSize: 20, justifyContent: 'center', alignSelf: 'flex-start', flex:4
    }
})
