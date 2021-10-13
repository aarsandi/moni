import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'

import { inputNabung } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'

export default function FormNabung({navigation}) {
    const dispatch = useDispatch()
    const { nama, amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        type: "",
        amount: "",
        tax: ""
    })
    const [amntRekening, setAmntRekening] = useState("")
    const [amntTabungan, setAmntTabungan] = useState("")

    const handleChange = (value, field) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }

    const handleChangeMany = (value) => {
        setFormData({
            ...formData,
            ...value
        })
    }

    const handleSubmit = () => {
        const findEmpty = Object.keys(formData).find((el) => formData[el]==="")
        if(findEmpty) {
            setError(`harap isi field ${findEmpty}`)
        } else {
            if(formData.type === "Rekening"){
                if(amntRekening&&amntTabungan) {
                    if(formData.tax<0) {
                        setError("jumlah Rekening Sekarang tidak boleh lebih kecil dari rekening yang sebelumnya")
                    }else{
                        inputNabung(dispatch, {
                            title:"Nabung",
                            type:formData.type,
                            inputAmount:Number(formData.amount),
                            tax:Number(formData.tax),
                            amountRekeningBfr:amountDompet,
                            amountTabunganBfr:amountTabungan,
                            amountRekeningAft:Number(amntRekening),
                            amountTabunganAft:Number(amntTabungan),
                            amountDompetCash:0,
                            date:Date.parse(new Date())
                        }, (el) => {
                            if(el.message === "success") {
                                navigation.navigate("Splash")
                            }
                        })
                    }
                }else{
                    setError(`harap isi field kosong`)
                }
            }else{
                if(amntTabungan) {
                    if(formData.tax<0) {
                        setError("jumlah yang diinput tidak sesuai")
                    }else{
                        inputNabung(dispatch, {
                            title:"Nabung",
                            type:formData.type,
                            inputAmount:Number(formData.amount),
                            tax:Number(formData.tax),
                            amountRekeningBfr:0,
                            amountTabunganBfr:amountTabungan,
                            amountRekeningAft:0,
                            amountTabunganAft:Number(amntTabungan),
                            amountDompetCash:amountRealDompet,
                            date:Date.parse(new Date())
                        }, (el) => {
                            if(el.message === "success") {
                                navigation.navigate("Splash")
                            }
                        })
                    }
                }else{
                    setError(`harap isi field kosong`)
                }
            }
        }
    }

    useEffect(() => {
        if(formData.type==="Rekening"&&amntTabungan&&amntRekening) {
            const amountReal = Number(amntTabungan)-amountTabungan
            const taxReal = (amountDompet-Number(amntRekening))-amountReal
            handleChangeMany({tax:String(taxReal),amount:String(amountReal)})
        }else if(formData.type==="Rekening"){
            handleChangeMany({tax:"",amount:""})
        }
    }, [formData.amount, amntRekening, amntTabungan, formData.type])

    useEffect(() => {
        if(formData.type==="Cash"&&amntTabungan&&formData.amount) {
            const amountReal = Number(amntTabungan)-amountTabungan
            const taxReal = Number(formData.amount)-amountReal
            handleChangeMany({tax:String(taxReal)})
        }else if(formData.type==="Cash"){
            handleChangeMany({tax:""})
        }
    }, [formData.amount, amntTabungan, formData.type])

    useEffect(() => {
        handleChangeMany({ amount: "", tax: ""})
        setAmntTabungan("")
        setAmntRekening("")
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
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
            <Text style={ { fontSize: 20, fontWeight: 'bold' } }>Form Nabung</Text>
                <Text>Tabungan anda sekarang: {toRupiah(amountTabungan, "Rp. ")}</Text>
                {formData.type==="Cash"&&
                    <Text style={{marginBottom:30}}>Uang Cash sekarang: {toRupiah(amountRealDompet, "Rp. ")}</Text>
                }
                {formData.type==="Rekening"&&
                    <Text style={{marginBottom:30}}>Rekening anda sekarang: {toRupiah(amountDompet, "Rp. ")}</Text>
                }
            
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Metode Nabung</Text>
                <SelectDropdown data={["Cash", "Rekening"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
                {
                    formData.type==="Rekening"?
                    <>
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang Direkening:</Text>
                        <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                        <MaskInput keyboardType='number-pad'
                            value={amntRekening} onChangeText={(masked, unmasked, obfuscated) => { setAmntRekening(unmasked) }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang DiTabungan:</Text>
                        <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                        <MaskInput keyboardType='number-pad'
                            value={amntTabungan} onChangeText={(masked, unmasked, obfuscated) => { setAmntTabungan(unmasked) }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah:</Text>
                        {/* <MaskInput keyboardType='number-pad'
                            value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        /> */}
                        <TextInput editable={false} value={formData.amount} placeholder="Jumlah" placeholderTextColor="#838383" />
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax:</Text>
                        <TextInput editable={false} value={formData.tax} placeholder="Tax" placeholderTextColor="#838383" />
                    </>:
                    <>
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
                        <MaskInput keyboardType='number-pad'
                            value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang DiTabungan:</Text>
                        <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                        <MaskInput keyboardType='number-pad'
                            value={amntTabungan} onChangeText={(masked, unmasked, obfuscated) => { setAmntTabungan(unmasked) }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax:</Text>
                        <TextInput editable={false} value={formData.tax} placeholder="Tax" placeholderTextColor="#838383" />
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
                        setAmntRekening("")
                        navigation.navigate("Splash")
                    }} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
