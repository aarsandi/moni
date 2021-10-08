import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { setupFinance } from "../../store/finance/function"
import {useSelector, useDispatch} from 'react-redux'
import { useIsFocused } from "@react-navigation/native";
import MaskInput, { createNumberMask }  from 'react-native-mask-input';

export default function Register({navigation}) {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { nama, amountTabungan, amountDompet } = useSelector((state) => state.financeReducer)
    const [error, setError] = useState(null)
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
            setError(`harap isi field ${findEmpty}`)
        } else {
            setupFinance(dataRegister, dispatch, (el) => {
                if(el.message=="success") {
                    setError(null)
                    navigation.navigate("AppScreenNavigator")
                }else{
                    setError("function error!")
                }
            })
        }
    }

    useEffect(() => {
        if(nama&&amountTabungan&&amountDompet) {
            navigation.navigate("AppScreenNavigator")
        }
    }, [isFocused])

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Input Data Finansial</Text>
            
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Nama :</Text>
            <TextInput onChangeText={text => onHandleChange(text, 'nama')} placeholder="nama lengkap" style={ styles.textInput } placeholderTextColor="#838383" />
            
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah Tabungan :</Text>
            <MaskInput keyboardType='number-pad' 
                value={dataRegister.amountTabungan} onChangeText={(masked, unmasked, obfuscated) => { onHandleChange(unmasked, 'amountTabungan') }}
                mask={createNumberMask({
                  prefix: ['Rp.', ' '],
                  delimiter: ',',
                  precision: 3,
                })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah Dompet (Cash) :</Text>
            <MaskInput keyboardType='number-pad' 
                value={dataRegister.amountRealDompet} onChangeText={(masked, unmasked, obfuscated) => { onHandleChange(unmasked, 'amountRealDompet') }}
                mask={createNumberMask({
                  prefix: ['Rp.', ' '],
                  delimiter: ',',
                  precision: 3,
                })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah Dompet (Non Cash) :</Text>
            <MaskInput keyboardType='number-pad' 
                value={dataRegister.amountDompet} onChangeText={(masked, unmasked, obfuscated) => { onHandleChange(unmasked, 'amountDompet') }}
                mask={createNumberMask({
                  prefix: ['Rp.', ' '],
                  delimiter: ',',
                  precision: 3,
                })}
            />
            
            <TouchableOpacity onPress={ handleSubmit } style={ { backgroundColor: '#ea8685' } }>
                <Text style={ { ...styles.buttonText, color: 'white' } }>Submit</Text>
            </TouchableOpacity>
            { 
                error && <Text>{error}</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderRadius: 25,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        backgroundColor: "white",
        shadowColor: "#6e6d6d",
        shadowOffset: {
            width: 8,
            height: 8
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }
})
