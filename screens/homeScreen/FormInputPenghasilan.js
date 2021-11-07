import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { inputPenghasilan } from '../../store/app/function'

import CompFormInputPenghasilan from '../../components/Form/CompFormInputPenghasilan';

export default function FormInputPenghasilan({navigation}) {
    const dispatch = useDispatch()
    const { nama, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
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
                    <CompFormInputPenghasilan data={{amountDompet, amountRealDompet}} onSubmit={handleSubmit} navigation={navigation} />
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
