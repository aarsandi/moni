import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { toRupiah } from '../../helpers/NumberToString'

import { inputPenghasilan } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'

import CompFormInputPenghasilan from '../../components/Form/CompFormInputPenghasilan';

export default function FormInputPenghasilan({navigation}) {
    const dispatch = useDispatch()
    const { amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    
    const handleSubmit = (val) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                const result = {...val, amountDompet, amountRealDompet}
                
                inputPenghasilan(dispatch, result, (el) => {
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
        if(amountDompet===null&&amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message !== "success") {
                    navigation.navigate("Splash")
                }
            })
        }
    }, [])

    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <Text style={ { fontSize: 20, fontWeight: 'bold' } }>Form Input Penghasilan</Text>
                <Text >Cash anda sekarang: {toRupiah(amountRealDompet, "Rp. ")}</Text>
                <Text style={{marginBottom:30}}>Rekening anda sekarang: {toRupiah(amountDompet, "Rp. ")}</Text>
                <CompFormInputPenghasilan data={{amountDompet, amountRealDompet}} onSubmit={handleSubmit} navigation={navigation} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
