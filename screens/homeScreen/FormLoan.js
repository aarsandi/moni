import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Alert, ScrollView, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import CompFormLoan from '../../components/Form/CompFormLoan'
import { inputPengajuanLoan } from '../../store/app/function'

export default function FormLoan({ navigation }) {
    const dispatch = useDispatch()
    const { nama,amountDompet, amountRealDompet, amountTabungan } = useSelector((state) => state.financeReducer)
    const [loading, setLoading] = useState(true)

    const handleSubmit = (val) => {
        if(amountDompet&&amountRealDompet&&amountTabungan) {
            Alert.alert("Info", "are you sure?", [{
                text: "Ok",
                onPress: () => {
                    inputPengajuanLoan(dispatch, {...val, amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet}, (el) => {
                        if(el.message === "success") {
                            navigation.navigate("Splash")
                        }else{
                            Alert.alert("Error", "Error Function", [], { cancelable:true })
                        }
                    })
                },
                style: "ok",
            }], { cancelable:true })        
        }else{
            Alert.alert("Error", "Error Function", [], { cancelable:true })
        }
    }

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            setLoading(false)
        }
    }, [])

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 50 }}> ..... </Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    <CompFormLoan data={{amountDompet, amountTabungan}} onSubmit={handleSubmit} navigation={navigation}/>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
