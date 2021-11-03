import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { inputAmbilCash } from '../../store/app/function'

import CompFormAmbilCash from '../../components/Form/CompFormAmbilCash';


export default function FormAmbilCash({ navigation }) {
    const dispatch = useDispatch()
    const { nama, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
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
        if(nama===null) {
            navigation.navigate("Splash")
        } else {
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
                <CompFormAmbilCash data={{amountDompet}} onSubmit={handleSubmit} navigation={navigation}/>
            }
        </View>
    )
}

const styles = StyleSheet.create({
})
