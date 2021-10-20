import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Alert, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import CompFormLoan from '../../components/Form/CompFormLoan'
import { fetchFinance } from '../../store/finance/function'
import { inputPengajuanLoan } from '../../store/app/function'

export default function FormLoan({ navigation }) {
    const dispatch = useDispatch()
    const { amountDompet, amountRealDompet, amountTabungan } = useSelector((state) => state.financeReducer)
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
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                {
                    !loading&&
                    <CompFormLoan data={{amountDompet, amountTabungan}} onSubmit={handleSubmit} navigation={navigation}/>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
