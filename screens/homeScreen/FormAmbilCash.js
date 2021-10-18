import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Alert, } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { inputAmbilCash } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'

import CompFormAmbilCash from '../../components/Form/CompFormAmbilCash';


export default function FormAmbilCash({ navigation }) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const [loading, setLoading] = useState(true)
    
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
        if(amountTabungan===null, amountDompet===null, amountRealDompet===null) {
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
            <Text>Ambil Cash</Text>
            <Text>Uang di dompet rekening : {amountDompet}</Text>
            <Text>uang Cash : {amountRealDompet}</Text>

            <CompFormAmbilCash data={{amountDompet}} onSubmit={handleSubmit} navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
})
