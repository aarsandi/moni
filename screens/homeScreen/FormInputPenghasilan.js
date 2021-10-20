import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { toRupiah } from '../../helpers/NumberToString'

import { inputPenghasilan } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'

import CompFormInputPenghasilan from '../../components/Form/CompFormInputPenghasilan';

export default function FormInputPenghasilan({navigation}) {
    const dispatch = useDispatch()
    const { amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const [loading, setLoading] = useState(true)
    
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
        if(amountDompet===null, amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message==="success") {
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setLoading(false)
        }
    }, [])

    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <CompFormInputPenghasilan data={{amountDompet, amountRealDompet}} onSubmit={handleSubmit} navigation={navigation} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
