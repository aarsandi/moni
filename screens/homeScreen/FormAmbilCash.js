import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'

import { fetchFinance, updateFinance } from '../../store/finance/function'
import { addHistDom } from '../../store/historyActivityDompet/function'
import { fetchPlan } from '../../store/plan/function';

import { toRupiah } from '../../helpers/NumberToString'

export default function FormAmbilCash({ navigation }) {
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const [dataForm, setDataForm] = useState({
        amount: "",
        sisaBalance: "",
        tax: ""
    })

    const handleChange = (value, field) => {
        setDataForm({
            ...dataForm,
            [field]: value
        })
    }
    
    const handleSubmit = () => {
        const findEmpty = Object.keys(dataForm).find((el) => dataForm[el]==="")
        if(findEmpty) {
            setError(`harap isi field ${findEmpty}`)
        } else {
            const realAmount = Number(dataForm.tax)+Number(dataForm.amount)
            if(amountDompet<realAmount) {
                setError('uang di rekening tidak cukup')
            }else{
                const result = {
                    title: "Ambil Cash",
                    detail: "-",
                    type: "Pengeluaran",
                    amount: realAmount,
                    balanceAfr: amountDompet-realAmount,
                    balanceBfr: amountDompet,
                    date: Date.parse(new Date())
                }
                addHistDom(dispatch, result, (el) => {
                    if(el.message==="success") {
                        updateFinance(dispatch, {amountDompet: amountDompet-realAmount,amountRealDompet: amountRealDompet+Number(dataForm.amount)}, (el) => {
                            if(el.message==="success") {
                                navigation.navigate("Home")
                            }
                        })
                    }
                })
            }
        }
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

    useEffect(() => {
        if(dataForm.sisaBalance&&dataForm.amount) {
            const tax = amountDompet-(Number(dataForm.sisaBalance)+Number(dataForm.amount))
            handleChange(String(tax), "tax")
        }else{
            handleChange("", "tax")
        }
    }, [dataForm.amount,dataForm.sisaBalance])

    return (
        <View>
            <Text>Ambil Cash</Text>
            <Text>Uang di dompet rekening : {amountDompet}</Text>
            <Text>uang Cash : {amountRealDompet}</Text>

            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
            <MaskInput keyboardType='number-pad'
                value={dataForm.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amount') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Sisa Direkening :</Text>
            <MaskInput keyboardType='number-pad'
                value={dataForm.sisaBalance} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'sisaBalance') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax : {dataForm.tax?dataForm.tax:"-"}</Text>
            {
                error&&
                <Text style={{ color: "red" }}>note: {error}</Text>
            }
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => handleSubmit()}
            >
                <Text style={styles.textStyle}>Submit</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    setDataForm({amount: "", sisaBalance: "", tax: ""})
                    navigation.navigate("Splash")
                }}
            >
                <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
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
