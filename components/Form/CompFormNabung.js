import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CompFormNabung({data, onSubmit, navigation}) {
    const { amountTabungan, amountDompet, amountRealDompet, jumlahDitabung } = data
    const [formData, setFormData] = useState({
        type: "",
        amount: "",
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
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
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
        if(formData.type!==""&&formData.amount!==""&&formData.amountDompetAft!==""&&formData.amountTabunganAft!=="") {
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
    }, [navigation, formData.type, formData.amount, formData.amountDompetAft, formData.amountTabunganAft, formData.taxPenerima, formData.taxPengirim ]);

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
            handleChangeMany({ amount: String(jumlahDitabung) , taxPengirim: "0", taxPenerima: "0", amountDompetAft: "", amountTabunganAft: "" })
        }else{
            handleChangeMany({ amount: "", taxPengirim: "0", taxPenerima: "0", amountDompetAft: "", amountTabunganAft: "" })
        }
    }, [formData.type])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.titleForm}>Metode Nabung</Text>
            <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                data={["Cash", "Rekening"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
            {
                formData.type==="Rekening"&&
                <>
                    {
                        jumlahDitabung?
                        <>
                            <Text style={styles.titleForm}>Jumlah</Text>
                            <TextInput style={styles.formInput} editable={false} value={toRupiah(formData.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        </>:
                        <>
                            <Text style={styles.titleForm}>Jumlah</Text>
                            <MaskInput keyboardType='number-pad' style={styles.formInput}
                                value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                        </>
                    }
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.titleForm}>Balance Rekening</Text>
                            <TextInput editable={false} value={toRupiah(amountDompet)} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                            <Text style={styles.titleForm}>Rekening Setelahnya</Text>
                            <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                            <MaskInput keyboardType='number-pad' style={styles.formInput}
                                value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountDompetAft') }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                            <Text style={styles.titleForm}>Tax Pengirim :</Text>
                            <TextInput editable={false} value={toRupiah(formData.taxPengirim, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.titleForm}>Balance Tabungan</Text>
                            <TextInput editable={false} value={toRupiah(amountTabungan)} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                            <Text style={styles.titleForm}>Tabunggan Setelahnya</Text>
                            <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                            <MaskInput keyboardType='number-pad' style={styles.formInput}
                                value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountTabunganAft') }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />

                            <Text style={styles.titleForm}>Tax Penerima :</Text>
                            <TextInput editable={false} value={toRupiah(formData.taxPenerima, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        </View>
                    </View>

                </>
            }

            { formData.type==="Cash"&&
                <>
                    {
                        jumlahDitabung?
                        <>
                            <Text style={styles.titleForm}>Jumlah</Text>
                            <TextInput style={styles.formInput} editable={false} value={toRupiah(formData.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        </>:
                        <>
                            <Text style={styles.titleForm}>Jumlah</Text>
                            <MaskInput keyboardType='number-pad' style={styles.formInput}
                                value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                        </>
                    }

                    <Text style={styles.titleForm}>Balance Tabungan</Text>
                    <TextInput editable={false} value={toRupiah(amountTabungan)} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    <Text style={styles.titleForm}>Tabunggan Setelahnya</Text>
                    <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan uang sudah di transfer</Text>
                    <MaskInput keyboardType='number-pad' style={styles.formInput}
                        value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountTabunganAft') }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />

                    <Text style={styles.titleForm}>Tax Penerima</Text>
                    <TextInput editable={false} value={toRupiah(formData.taxPenerima, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                </>
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
