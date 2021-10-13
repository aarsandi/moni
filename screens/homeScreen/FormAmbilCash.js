import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'

import { inputAmbilCash } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'

import CompFormAmbilCash from '../../components/Form/CompFormAmbilCash';


export default function FormAmbilCash({ navigation }) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    
    const handleSubmit = (val) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                const result = {...val, amountDompet, amountRealDompet}
                inputAmbilCash(dispatch, result, (el) => {
                    if(el.message === "success") {
                        navigation.navigate("Splash")
                    }else{
                        Alert.alert("Error", "Fungsi Error", [], { cancelable:true })
                    }
                })
            },
            style: "ok",
        }], { cancelable:true })
    }

    useEffect(() => {
        if(amountTabungan===null&&amountDompet===null&&amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message !== "success") {
                    navigation.navigate("Splash")
                }
            })
        }
    }, [])

    return (
        <View>
            <Text>Ambil Cash</Text>
            <Text>Uang di dompet rekening : {amountDompet}</Text>
            <Text>uang Cash : {amountRealDompet}</Text>

            <CompFormAmbilCash data={{amountDompet}} onSubmit={handleSubmit} navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
})
