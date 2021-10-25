import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ToastAndroid, TextInput, TouchableOpacity } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import { toRupiah } from '../../helpers/NumberToString'

export default function CompFormPayLoan({data, onSubmit, navigation}) {
    const { amountDompet, amountTabungan, title, detail, type, amountPay } = data

    const [formData, setFormData] = useState({
        taxPengirim: "0",
        taxPenerima: "0",
        amountTabunganAft: "",
        amountDompetAft: "",
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
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
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
                ToastAndroid.show('kesalahan pada form balance', ToastAndroid.SHORT)
            }
        }

    }

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action)
        })
    },[navigation]);
    
    React.useEffect(() => {
        if(formData.taxPengirim!==""&&formData.taxPenerima!==""&&formData.amountTabunganAft!==""&&formData.amountDompetAft!=="") {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Create</Text>
                    </TouchableOpacity>
                ),
            });
        }else{
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity disabled={true}>
                        <Text style={{ color: 'grey', fontSize: 18, paddingRight: 10 }}>Create</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, formData.taxPengirim, formData.taxPenerima, formData.amountTabunganAft, formData.amountDompetAft]);
    
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
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.titleForm}>Title</Text>
            <TextInput editable={false} style={styles.formInput} value={title} placeholder="" placeholderTextColor="#838383"/>
            <Text style={styles.titleForm}>Amount</Text>
            <TextInput editable={false} style={styles.formInput} value={toRupiah(amountPay[0].amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
            {
                data.type==="Tabungan"&&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.titleForm}>Amount Tabungan :</Text>
                        <TextInput editable={false} value={toRupiah(amountTabungan, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        <Text style={styles.titleForm}>Amount Tabungan Setelahnya</Text>
                        <MaskInput keyboardType='number-pad' style={styles.formInput}
                            value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountTabunganAft") }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={styles.titleForm}>Tax Pengirim :</Text>
                        <TextInput editable={false} style={styles.formInput} value={toRupiah(formData.taxPengirim, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.titleForm}>Amount Rekening :</Text>
                        <TextInput editable={false} value={toRupiah(amountDompet, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        <Text style={styles.titleForm}>Amount Rekening Setelahnya</Text>
                        <MaskInput keyboardType='number-pad' style={styles.formInput}
                            value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountDompetAft") }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={styles.titleForm}>Tax Penerima :</Text>
                        <TextInput editable={false} style={styles.formInput} value={toRupiah(formData.taxPenerima, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    titleForm: {
        fontSize: 15, fontWeight: 'bold'
    },
    formInput: {
        borderBottomWidth: 2,
        borderColor:'#bee3db',
        marginBottom: 10
    }
})
