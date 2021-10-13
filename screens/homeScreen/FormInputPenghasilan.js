import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'

import { fetchFinance, updateFinance } from '../../store/finance/function'
import { addHistDom } from '../../store/historyActivityDompet/function'

export default function FormInputPenghasilan({navigation}) {
    const dispatch = useDispatch()
    const { nama, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        type: "",
        amount: ""
    })
    const [amountRekening, setAmountRekening] = useState("")

    const handleChange = (value, field) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }
    
    const handleSubmit = () => {
        const findEmpty = Object.keys(formData).find((el) => formData[el]==="")
        if(findEmpty) {
            setError(`harap isi field ${findEmpty}`)
        } else {
            if(formData.type === "Rekening"){
                if(amountRekening<amountDompet) {
                    setError("jumlah Rekening Sekarang tidak boleh lebih kecil dari rekening yang sebelumnya")
                }else{
                    updateFinance(dispatch, {amountDompet: Number(amountRekening)}, (el) => {
                        if(el.message === "success") {
                            addHistDom(dispatch, {
                                title: "Penghasilan",detail:"-",type:"Pemasukan",amount:Number(formData.amount),
                                balanceAfr: Number(amountRekening), balanceBfr:amountDompet, date:Date.parse(new Date())
                            }, (el) => {
                                if(el.message === "success") {
                                    navigation.navigate("Splash")
                                }else{
                                    setError("error function")
                                }
                            })
                        }else{
                            setError("error function")
                        }
                    })
                }
                
            }else{
                updateFinance(dispatch, {amountRealDompet: Number(formData.amount)}, (el) => {
                    if(el.message === "success") {
                        navigation.navigate("Splash")
                    }else{
                        setError("error function")
                    }
                })
            }
        }
    }

    useEffect(() => {
        if(formData.type==="Rekening"&&amountRekening) {
            const amountReal = Number(amountRekening)-amountDompet
            handleChange(String(amountReal), "amount")
        }
    }, [formData.amount, amountRekening, formData.type])

    useEffect(() => {
        handleChange("", "amount")
        setAmountRekening("")
    }, [formData.type])
    
    useEffect(() => {
        if(nama===null&&amountDompet===null&&amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [nama, amountDompet, amountRealDompet])

    return (
        <View>
            <Text style={ { fontSize: 20, fontWeight: 'bold' } }>Form Input Penghasilan</Text>
            <Text style={{marginBottom:30}}>Rekening anda sekarang: {toRupiah(amountDompet, "Rp. ")}</Text>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Kategori Penghasilan</Text>
                <SelectDropdown data={["Cash", "Rekening"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
                {
                    formData.type==="Rekening"?
                    <>
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang Direkening Anda:</Text>
                        <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan gaji sudah masuk ke rekening</Text>
                        <MaskInput keyboardType='number-pad'
                            value={amountRekening} onChangeText={(masked, unmasked, obfuscated) => { setAmountRekening(unmasked) }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                    </>:
                    <>
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
                        <MaskInput keyboardType='number-pad'
                            value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                    </>
                }
                {
                    error&&
                    <Text style={{ color: "red" }}>note: {error}</Text>
                }
                <View style={{marginVertical:10}}>
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
                
                <View style={{marginVertical:10}}>
                    <Button title="Cancel" onPress={() => {
                        setFormData({type: "",amount: ""})
                        setAmountRekening("")
                        navigation.navigate("Splash")
                    }} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
