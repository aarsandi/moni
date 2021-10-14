import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import { toRupiah } from '../../helpers/NumberToString'

export default function CompFormPayLoan({data, onSubmit, navigation}) {
    const { amountDompet, amountRealDompet, amountTabungan, title, detail, type, amountPay } = data

    const [formData, setFormData] = useState({
        taxPengirim: "0",
        taxPenerima: "0",
        amountTabunganAft: "",
        amountDompetAft: "",
    })

    const [error, setError] = useState(null)

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
            if(Number(formData.taxPengirim)>=0&&Number(formData.taxPenerima)>=0) {
                const result = {
                    title: title,
                    detail: detail,
                    type: type,
                    amount: amountPay[0].amount,
                    taxPengirim: Number(formData.taxPengirim),
                    taxPenerima: Number(formData.taxPenerima),
                    amountTabunganAft: Number(formData.amountTabunganAft),
                    amountDompetAft: Number(formData.amountDompetAft)
                }
                onSubmit(result)
            } else {
                setError('kesalahan pada form balance')
            }
        }

    }
    
    useEffect(() => {
        if(type==="Tabungan"&&amountDompet&&amountTabungan&&formData.amountTabunganAft&&formData.amountDompetAft) {
            const taxPengirim = (amountDompet-Number(formData.amountDompetAft))-amountPay[0].amount
            const taxPenerima = amountPay[0].amount-(Number(formData.amountTabunganAft)-amountTabungan)
            handleChangeMany({taxPengirim: taxPengirim, taxPenerima: taxPenerima})
        }
    }, [formData.amountTabunganAft, formData.amountDompetAft, type])

    useEffect(() => {
        if(type==="Cash") {
            handleChangeMany({taxPengirim: "0", taxPenerima: "0", amountTabunganAft:"0", amountDompetAft: "0"})
        }
    }, [type])

    return (
        <View>
            <Text>Pay Loan</Text>
            
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount :</Text>
            <TextInput editable={false} value={toRupiah(amountPay[0].amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>

            {
                data.type==="Tabungan"&&
                <>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Rekening Setelahnya:</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountDompetAft") }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Tabungan Setelahnya:</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountTabunganAft") }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                    
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax Pengirim :</Text>
                    <TextInput editable={false} value={toRupiah(formData.taxPengirim, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax Penerima :</Text>
                    <TextInput editable={false} value={toRupiah(formData.taxPenerima, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
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
                    navigation.navigate("Splash")
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
