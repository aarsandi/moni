import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import { toRupiah } from '../../helpers/NumberToString'

export default function CompFormAmbilCash({data, onSubmit, navigation}) {
    const { amountDompet } = data
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
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            const result = {
                amount: Number(dataForm.amount),
                amountDompetAft: Number(dataForm.amountDompetAft),
                tax: Number(dataForm.tax)
            }
            if(amountDompet<result.amount) {
                ToastAndroid.show('balance kurang', ToastAndroid.SHORT)
            }else if(result.tax<0) {
                ToastAndroid.show('tax tidak boleh minus', ToastAndroid.SHORT)
            }else{
                onSubmit(result)
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
        if(dataForm.amount!==""&&dataForm.amountDompetAft!==""&&dataForm.tax!=="") {
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
    }, [navigation, dataForm.amount, dataForm.amountDompetAft, dataForm.tax]);

    useEffect(() => {
        if(dataForm.amountDompetAft&&dataForm.amount) {
            const tax = (amountDompet-Number(dataForm.amountDompetAft))-Number(dataForm.amount)
            handleChange(String(tax), "tax")
        }
    }, [dataForm.amount,dataForm.amountDompetAft])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.titleForm}>Jumlah</Text>
            <MaskInput keyboardType='number-pad' style={styles.formInput}
                value={dataForm.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amount') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={styles.titleForm}>Sisa Direkening</Text>
            <MaskInput keyboardType='number-pad' style={styles.formInput}
                value={dataForm.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountDompetAft') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={styles.titleForm}>Tax</Text>
            <TextInput editable={false} value={toRupiah(dataForm.tax, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
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
    },})
