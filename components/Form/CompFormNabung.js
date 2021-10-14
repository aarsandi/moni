import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'

export default function CompFormNabung({data, onSubmit, navigation}) {
    const { amountTabungan, amountDompet, amountRealDompet, jumlahDitabung } = data
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        type: "",
        amount: jumlahDitabung?String(jumlahDitabung):"",
        taxPengirim: "0",
        taxPenerima: "0",
        amountDompetAft: "",
        amountTabunganAft: ""
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
            if(Number(formData.taxPengirim)>=0&&Number(formData.taxPenerima)>=0) {
                const result = {
                    type: formData.type,
                    amount: Number(formData.amount),
                    taxPengirim: Number(formData.taxPengirim),
                    taxPenerima: Number(formData.taxPenerima),
                    amountDompetAft: Number(formData.amountDompetAft),
                    amountTabunganAft: Number(formData.amountTabunganAft)
                }
                onSubmit(result)
            }else{
                setError('kesalahan pada form balance')
            }
        }
    }

    useEffect(() => {
        if(formData.type==="Rekening"&&formData.amountTabunganAft&&formData.amountDompetAft&&formData.amount) {
            const taxPengirim = (amountDompet-Number(formData.amountDompetAft))-Number(formData.amount)
            const taxPenerima = Number(formData.amount)-(Number(formData.amountTabunganAft)-amountTabungan)
            handleChangeMany({taxPengirim: taxPengirim, taxPenerima: taxPenerima})
        }
    }, [formData.amount, formData.amountDompetAft, formData.amountTabunganAft, formData.type])

    useEffect(() => {
        if(formData.type==="Cash"&&formData.amountTabunganAft&&formData.amount) {
            const taxPenerima = Number(formData.amount)-(Number(formData.amountTabunganAft)-amountTabungan)
            handleChangeMany({taxPenerima:String(taxPenerima), amountDompetAft: "0"})
        }
    }, [formData.amount, formData.amountTabunganAft, formData.type])

    useEffect(() => {
        if(jumlahDitabung){
            handleChangeMany({ taxPengirim: "0", taxPenerima: "0", amountDompetAft: "", amountTabunganAft: "" })
        }else{
            handleChangeMany({ amount: "", taxPengirim: "0", taxPenerima: "0", amountDompetAft: "", amountTabunganAft: "" })
        }
    }, [formData.type])

    return (
        <View>
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
                    {
                        jumlahDitabung?
                        <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah:</Text>
                            <TextInput editable={false} value={toRupiah(formData.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        </>:
                        <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah:</Text>
                            <MaskInput keyboardType='number-pad'
                                value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                        </>
                    }
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang Direkening:</Text>
                    <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountDompetAft') }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang DiTabungan:</Text>
                    <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountTabunganAft') }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax Pengirim :</Text>
                    <TextInput editable={false} value={toRupiah(formData.taxPengirim, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tax Penerima :</Text>
                    <TextInput editable={false} value={toRupiah(formData.taxPenerima, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                </>:
                <>
                    {
                        jumlahDitabung?
                        <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah:</Text>
                            <TextInput editable={false} value={toRupiah(formData.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        </>:
                        <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah:</Text>
                            <MaskInput keyboardType='number-pad'
                                value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                        </>
                    }

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang DiTabungan:</Text>
                    <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountTabunganAft') }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />

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
                    setFormData({type: "",amount: "", taxPengirim: "0", taxPenerima: "0", amountDompetAft: "",amountTabunganAft: ""})
                    navigation.navigate("Splash")
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
