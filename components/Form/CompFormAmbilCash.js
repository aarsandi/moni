import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import { toRupiah } from '../../helpers/NumberToString'

export default function CompFormAmbilCash({data, onSubmit, navigation}) {
    const { amountDompet } = data
    const [error, setError] = useState(null)
    const [dataForm, setDataForm] = useState({
        amount: "",
        amountDompetAft: "",
        tax: "0"
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
            const result = {
                amount: Number(dataForm.amount),
                amountDompetAft: Number(dataForm.amountDompetAft),
                tax: Number(dataForm.tax)
            }
            if(amountDompet<result.amount) {
                setError('Balance Kurang')
            }else if(result.tax<0) {
                setError('tax tidak boleh minus')
            }else{
                onSubmit(result)
            }
        }
    }    

    useEffect(() => {
        if(dataForm.amountDompetAft&&dataForm.amount) {
            const tax = (amountDompet-Number(dataForm.amountDompetAft))-Number(dataForm.amount)
            handleChange(String(tax), "tax")
        }
    }, [dataForm.amount,dataForm.amountDompetAft])

    return (
        <View>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
            <MaskInput keyboardType='number-pad'
                value={dataForm.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amount') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Sisa Direkening :</Text>
            <MaskInput keyboardType='number-pad'
                value={dataForm.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountDompetAft') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax : {toRupiah(dataForm.tax, "Rp. ")}</Text>
            {
                error&&
                <Text style={{ color: "red" }}>note: {error}</Text>
            }
            <View style={{marginVertical:10}}>
                <Button title="Submit" onPress={handleSubmit} />
            </View>
            
            <View style={{marginVertical:10}}>
                <Button title="Cancel" onPress={() => {
                    setDataForm({amount: "", amountDompetAft: "", tax: "0"})
                    navigation.navigate("Splash")
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
