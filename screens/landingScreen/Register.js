import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import { setupFinance } from "../../store/finance/function"
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from "@react-navigation/native";
import MaskInput, { createNumberMask }  from 'react-native-mask-input';

export default function Register({navigation}) {
    const dispatch = useDispatch()
    const {isDarkMode} = useSelector((state) => state.appReducer)
    const isFocused = useIsFocused();
    const { nama } = useSelector((state) => state.financeReducer)
    const [dataRegister, setDataRegister] = useState({ nama: "", amountTabungan : "", amountDompet : "", amountRealDompet : "" })

    const onHandleChange = (value, field) => {
        setDataRegister({
            ...dataRegister,
            [field]: value
        })
    }

    const handleSubmit = () => {
        const findEmpty = Object.keys(dataRegister).find((el) => dataRegister[el]==="")
        if(findEmpty) {
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            setupFinance(dataRegister, dispatch, (el) => {
                if(el.message==="success") {
                    navigation.navigate("AppScreenNavigator")
                }else{
                    ToastAndroid.show('function error!', ToastAndroid.SHORT)
                }
            })
        }
    }

    useEffect(() => {
        if(nama!==null) {
            navigation.navigate("AppScreenNavigator")
        }
    }, [isFocused])

    return (
        <View style={{ backgroundColor: isDarkMode, flex: 1, justifyContent: 'center' }}>
            <View style={{ borderColor: "#bee3db", borderWidth: 2, margin: 10, borderRadius: 5, paddingVertical: 35, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 30, alignSelf: 'center', marginBottom:30, fontWeight: 'bold' }}>Finance Form</Text>
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Full Name</Text>
                <TextInput style={styles.textInput} onChangeText={text => onHandleChange(text, 'nama')} placeholder="full name" />
                
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Saving Amount</Text>
                <MaskInput keyboardType='number-pad' style={styles.textInput}
                    value={dataRegister.amountTabungan} onChangeText={(masked, unmasked, obfuscated) => { onHandleChange(unmasked, 'amountTabungan') }}
                    mask={createNumberMask({
                    prefix: ['Rp.', ' '],
                    delimiter: ',',
                    precision: 3,
                    })}
                />
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Wallet Amount (in cash)</Text>
                <MaskInput keyboardType='number-pad' style={styles.textInput}
                    value={dataRegister.amountRealDompet} onChangeText={(masked, unmasked, obfuscated) => { onHandleChange(unmasked, 'amountRealDompet') }}
                    mask={createNumberMask({
                    prefix: ['Rp.', ' '],
                    delimiter: ',',
                    precision: 3,
                    })}
                />
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Wallet Amount (in account)</Text>
                <MaskInput keyboardType='number-pad'  style={styles.textInput}
                    value={dataRegister.amountDompet} onChangeText={(masked, unmasked, obfuscated) => { onHandleChange(unmasked, 'amountDompet') }}
                    mask={createNumberMask({
                    prefix: ['Rp.', ' '],
                    delimiter: ',',
                    precision: 3,
                    })}
                />
                
                <TouchableOpacity onPress={ handleSubmit } style={styles.buttonSubmit}>
                    <Text style={ { color: '#bee3db', fontSize: 15, alignSelf: 'center' } }>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

// colors
// abu abu: '#bee3db'
// Hijau Pekat: '#31572c'


const styles = StyleSheet.create({
    textInput: {
        borderBottomWidth: 2, borderColor:'#bee3db', marginBottom: 10
    },
    buttonSubmit: {
        backgroundColor: '#31572c', padding: 10, borderRadius: 10
    }
})
