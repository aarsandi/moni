import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'

export default function CompFormInputPenghasilan({data, onSubmit, navigation}) {
    const { amountDompet } = data
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        type: "",
        amount: "",
        amountDompetAft: ""
    })

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
            const result = {
                type: formData.type,
                amount: Number(formData.amount),
                amountDompetAft: Number(formData.amountDompetAft)
            }
            if(result.amount<0) {
                setError(`amount tidak boleh minus`)
            }else{
                onSubmit(result)
            }
        }
    }

    useEffect(() => {
        if(formData.type==="Rekening"&&formData.amountDompetAft) {
            const amountReal = Number(formData.amountDompetAft)-amountDompet
            handleChange(String(amountReal), "amount")
        }
    }, [formData.amountDompetAft, formData.type])

    useEffect(() => {
        if(formData.type==="Cash"&&formData.amount) {
            handleChange("0", "amountDompetAft")
        }
    }, [formData.amount, formData.type])

    useEffect(() => {
        handleChangeMany({ amount: "", amountDompetAft: ""})
    }, [formData.type])

    return (
        <View>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Kategori Penghasilan</Text>
            <SelectDropdown data={["Cash", "Rekening"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
            {
                formData.type==="Rekening"?
                <>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang Direkening Anda:</Text>
                    <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan gaji sudah masuk ke rekening</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountDompetAft') }}
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
                    setFormData({type: "",amount: "", amountDompetAft: ""})
                    navigation.navigate("Splash")
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
