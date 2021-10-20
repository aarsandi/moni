import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import { useDispatch } from 'react-redux';

export default function CompFormChangeAmount({data, onSubmit, navigation}) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = data
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

    const handleSubmit = () => {
        const findEmpty = Object.keys(dataForm).find((el) => dataForm[el]==="")
        if(findEmpty) {
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            const result = {
                amountTabungan: [Number(dataForm.amountTabunganAft), "amountTabunganAft"],
                amountDompet: [Number(dataForm.amountDompetAft), "amountDompetAft"],
                amountRealDompet: [Number(dataForm.amountRealDompetAft), "amountRealDompetAft"]
            }
            onSubmit(result)
        }
    }
    
    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action)
        })
    },[navigation]);

    React.useEffect(() => {
        if(dataForm.amountTabunganAft!=amountTabungan||dataForm.amountDompetAft!=amountDompet||dataForm.amountRealDompetAft!=amountRealDompet) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Change</Text>
                    </TouchableOpacity>
                ),
            });
        }else{
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity disabled={true}>
                        <Text style={{ color: 'grey', fontSize: 18, paddingRight: 10 }}>Change</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, dataForm.amountTabunganAft, dataForm.amountDompetAft, dataForm.amountRealDompetAft ]);

    useEffect(() => {
        if(amountTabungan&&amountDompet&&amountRealDompet) {
            handleChangeMany({amountTabunganAft:String(amountTabungan), amountDompetAft:String(amountDompet), amountRealDompetAft:String(amountRealDompet)})
        }
    }, [amountTabungan, amountDompet, amountRealDompet])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Cash:</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaskInput keyboardType='number-pad' style={{flex:3}}
                    value={dataForm.amountRealDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountRealDompetAft") }}
                    mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                />
                {
                    dataForm.amountRealDompetAft!=amountRealDompet&&
                    <TouchableOpacity style={{ flex:1, paddingVertical:5 }} onPress={() => handleChange(String(amountRealDompet) , "amountRealDompetAft")}>
                        <Text style={{ fontWeight: '500', textAlign: 'right' }}>cancel</Text>
                    </TouchableOpacity>
                }
            </View>

            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Dompet:</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaskInput keyboardType='number-pad' style={{flex:3}}
                    value={dataForm.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountDompetAft") }}
                    mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                />
                {
                    dataForm.amountDompetAft!=amountDompet&&
                    <TouchableOpacity style={{ flex:1, paddingVertical:5 }} onPress={() => handleChange(String(amountDompet) , "amountDompetAft")}>
                        <Text style={{ fontWeight: '500', textAlign: 'right' }}>cancel</Text>
                    </TouchableOpacity>
                }
            </View>

            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Amount Tabungan:</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaskInput keyboardType='number-pad' style={{flex:3}}
                    value={dataForm.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountTabunganAft") }}
                    mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                />
                {
                    dataForm.amountTabunganAft!=amountTabungan&&
                    <TouchableOpacity style={{ flex:1, paddingVertical:5 }} onPress={() => handleChange(String(amountTabungan) , "amountTabunganAft")}>
                        <Text style={{ fontWeight: '500', textAlign: 'right' }}>cancel</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
