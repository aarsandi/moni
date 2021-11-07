import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CompFormInputPenghasilan({data, onSubmit, navigation}) {
    const { amountDompet } = data
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
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            const result = {
                type: formData.type,
                amount: Number(formData.amount),
                amountDompetAft: Number(formData.amountDompetAft)
            }
            if(result.amount<0) {
                ToastAndroid.show('amount tidak boleh minus', ToastAndroid.SHORT)
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
        if(formData.type!==""&&formData.amount!==""&&formData.amountDompetAft!=="") {
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
    }, [navigation, formData.type, formData.amount, formData.amountDompetAft ]);

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
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.titleForm}>Kategori Penghasilan</Text>
            <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                data={["Cash", "Rekening"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
            {
                formData.type==="Rekening"&&
                <>
                    <Text style={styles.titleForm}>Balance Rekening</Text>
                    <TextInput editable={false} value={toRupiah(amountDompet)} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    <Text style={styles.titleForm}>Jumlah</Text>
                    <TextInput editable={false} value={toRupiah(formData.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                    <Text style={styles.titleForm}>Rekening Setelahnya</Text>
                    <Text style={ { fontSize: 8, fontWeight: 'bold' } }>note: pastikan gaji sudah masuk ke rekening</Text>
                    <MaskInput keyboardType='number-pad' style={styles.formInput}
                        value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amountDompetAft') }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                </>
            }
            { formData.type==="Cash"&&
                <>
                    <Text style={styles.titleForm}>Jumlah</Text>
                    <MaskInput keyboardType='number-pad' style={styles.formInput}
                        value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
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
    },
})
