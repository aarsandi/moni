import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'
import { changeFinanceAmount } from '../../store/app/function'
import { useDispatch } from 'react-redux';

export default function CompFormChangeAmount({data, navigation}) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = data
    const [ error, setError ] = useState(null)
    const [dataForm, setDataForm] = useState({
        amountTabunganAft: "0",
        amountDompetAft: "0",
        amountRealDompetAft: "0"
    })

    const handleChange = (value, field) => {
        setDataForm({
            ...dataForm,
            [field]: value
        })
    }

    const handleChangeMany = (value) => {
        setDataForm({
            ...dataForm,
            ...value
        })
    }

    const handleSubmit = (value, field) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                const result = {[field]:value}
                changeFinanceAmount(dispatch, {...result, amountTabungan, amountDompet, amountRealDompet}, (el) => {
                    if(el.message === "success") {
                        Alert.alert("Success", "Success change", [], { cancelable:true })
                    }else{
                        Alert.alert("Error", "error function", [], { cancelable:true })
                    }
                })
            },
            style: "ok",
        }], { cancelable:true }) 
    }

    useEffect(() => {
        if(amountTabungan&&amountDompet&&amountRealDompet) {
            handleChangeMany({amountTabunganAft:String(amountTabungan), amountDompetAft:String(amountDompet), amountRealDompetAft:String(amountRealDompet)})
        }
    }, [amountTabungan, amountDompet, amountRealDompet])

    return (
        <View>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Cash:</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaskInput keyboardType='number-pad' style={{flex:4}}
                    value={dataForm.amountRealDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountRealDompetAft") }}
                    mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                />
                {
                    dataForm.amountRealDompetAft!=amountRealDompet&&
                    <View style={{flex:1, paddingVertical:5}}>
                        <Button title="Change" onPress={() => {
                            handleSubmit(Number(dataForm.amountRealDompetAft), "amountRealDompetAft")
                        }}/>
                    </View>
                }
            </View>

            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Dompet:</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaskInput keyboardType='number-pad' style={{flex:4}}
                    value={dataForm.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountDompetAft") }}
                    mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                />
                {
                    dataForm.amountDompetAft!=amountDompet&&
                    <View style={{flex:1, paddingVertical:5}}>
                        <Button title="Change" onPress={() => {
                            handleSubmit(Number(dataForm.amountDompetAft), "amountDompetAft")
                        }}/>
                    </View>
                }
            </View>

            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Tabungan:</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaskInput keyboardType='number-pad' style={{flex:4}}
                    value={dataForm.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountTabunganAft") }}
                    mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                />
                {
                    dataForm.amountTabunganAft!=amountTabungan&&
                    <View style={{flex:1, paddingVertical:5}}>
                        <Button title="Change" onPress={() => {
                            handleSubmit(Number(dataForm.amountTabunganAft), "amountTabunganAft")
                        }}/>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
