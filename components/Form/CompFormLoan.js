import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ToastAndroid, TextInput, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Note: disini pengirimnya si Tabungan maka taxnya dari pengirim yaitu rek tabungan
export default function CompFormLoan({data, onSubmit, navigation}) {
    const { amountDompet, amountTabungan } = data
    
    const [openDatePick, setOpenDatePick] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        detail: "",
        type: "",
        amount: "",
        tenor: "",
        totalPerbulan: "",
        taxPengirim: "0",
        taxPenerima: "0",
        amountTabunganAft: "",
        amountDompetAft: "",
        due_date: new Date()
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
                let amountPayArr = []
                if(formData.type==="Cash") {
                    amountPayArr.push({amount:Number(formData.totalPerbulan),due_date:Date.parse(formData.due_date)})
                }else{
                    const nowDate = new Date()
                    const time = new Date(nowDate.getTime());
                    for (let i=1; i<=Number(formData.tenor); i++) {
                        const raiseDate = time.setMonth(nowDate.getMonth() + i)
                        amountPayArr.push({amount:Number(formData.totalPerbulan),due_date:raiseDate})
                    }
                }
                const result = {
                    title: formData.title,
                    detail: formData.detail,
                    type: formData.type,
                    amount: Number(formData.amount),
                    tenor: Number(formData.tenor),
                    amountPay:amountPayArr,
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
        if(formData.title!==""&&formData.detail!==""&&formData.type!==""&&formData.amount!==""&&formData.amountDompetAft!==""&&formData.amountTabunganAft!==""&&formData.totalPerbulan!=="") {
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
    }, [navigation, formData.title, formData.detail, formData.type, formData.amount, formData.amountDompetAft, formData.amountTabunganAft, formData.taxPengirim, formData.taxPenerima, formData.totalPerbulan ]);

    // hitung suku bunga
    useEffect(() => {
        if(formData.amount&&formData.tenor&&formData.type==="Tabungan") {
            const interest = (formData.amount * 0.05) / formData.tenor;
            const total = ((formData.amount / formData.tenor) + interest).toFixed(0);
            handleChangeMany({totalPerbulan: String(total), title:"Pinjaman Tabungan", detail: "-"})
        }
    }, [formData.amount, formData.tenor, formData.type])

    // hitung tax
    useEffect(() => {
        if(formData.amount&&formData.tenor&&formData.type==="Tabungan"&&formData.amountDompetAft&&formData.amountTabunganAft) {
            const taxPengirim = (amountTabungan-Number(formData.amountTabunganAft))-Number(formData.amount)
            const taxPenerima = Number(formData.amount)-(Number(formData.amountDompetAft)-amountDompet)
            handleChangeMany({taxPengirim: taxPengirim, taxPenerima: taxPenerima})
        }
    }, [formData.amount, formData.tenor, formData.type, formData.amountDompetAft, formData.amountTabunganAft])

    // handle data yang kurang saat pilih cash
    useEffect(() => {
        if(formData.type==="Cash"&&formData.amount) {
            handleChangeMany({tenor:"1", totalPerbulan:formData.amount, amountDompetAft: "0", amountTabunganAft: "0", taxPengirim: "0", taxPenerima: "0" })
        }
    }, [formData.type, formData.amount])

    // handle jika option di ganti
    useEffect(() => {
        handleChangeMany({ title: "", detail: "", amount: "", tenor: "", totalPerbulan: "", taxPengirim: "0", taxPenerima: "0", amountTabunganAft: "", amountDompetAft: ""})
    }, [formData.type])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.titleForm}>Type: </Text>
            <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                data={["Cash", "Tabungan"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>

            { formData.type==="Cash"&&
                <>
                    <Text style={styles.titleForm}>Title</Text>
                    <TextInput style={styles.formInput} onChangeText={text => handleChange(text, 'title')} placeholder="Judul" placeholderTextColor="#838383" />

                    <Text style={styles.titleForm}>Detail:</Text>
                    <View style={styles.textAreaContainer} >
                        <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            numberOfLines={5}
                            multiline={true}
                            onChangeText={text => handleChange(text, 'detail')}
                        />
                    </View>
                    <Text style={ styles.formTitle }>Due Date :</Text>
                    <TouchableWithoutFeedback onPress={() => setOpenDatePick(true)}>
                        <View><View pointerEvents="none">
                            <TextInput
                                style={styles.formInput}
                                value={moment(formData.due_date).format("DD MMM YYYY")}
                                editable={false}
                                placeholder={moment(formData.due_date).format("DD MMM YYYY")}
                            />
                        </View></View>
                    </TouchableWithoutFeedback>
                    <DatePicker modal open={openDatePick} date={formData.due_date} mode="date"
                        minimumDate={new Date()}
                        onConfirm={(date) => {
                            setOpenDatePick(false)
                            handleChange(date, 'due_date')
                        }}
                        onCancel={() => {
                            setOpenDatePick(false)
                        }}
                    />
                </>
            }

            <Text style={styles.titleForm}>Jumlah:</Text>
            <MaskInput keyboardType='number-pad' style={styles.formInput}
                value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            {
                formData.type==="Tabungan"&&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.titleForm}>Tenor</Text>
                        <SelectDropdown defaultButtonText="Choose.." buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                            data={["1", "3", "6", "9"]} onSelect={(selectedItem) => {
                                handleChange(selectedItem, 'tenor') }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem+ " bulan"
                                }}
                                rowTextForSelection={(item) => {
                                return item+" bulan"
                            }}/>
                        <Text style={styles.titleForm}>Balance Rekening:</Text>
                        <TextInput editable={false} value={toRupiah(amountDompet)} placeholder="Rp. 0" placeholderTextColor="#838383" />
                        <Text style={styles.titleForm}>Rekening Setelahnya:</Text>
                        <MaskInput style={styles.formInput} keyboardType='number-pad'
                            value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChangeMany({amountDompetAft:unmasked}) }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={styles.titleForm}>Tax Penerima</Text>
                        <TextInput editable={false} value={toRupiah(formData.taxPenerima, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.titleForm}>Bayar Perbulan :</Text>
                        <TextInput editable={false} value={toRupiah(formData.totalPerbulan, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                        <Text style={styles.titleForm}>Balance Tabungan:</Text>
                        <TextInput editable={false} value={toRupiah(amountTabungan)} placeholder="Rp. 0" placeholderTextColor="#838383" />
                        <Text style={styles.titleForm}>Tabungan Setelahnya:</Text>
                        <MaskInput style={styles.formInput} keyboardType='number-pad'
                            value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChangeMany({amountTabunganAft:unmasked}) }}
                            mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                        />
                        <Text style={styles.titleForm}>Tax Pengirim</Text>
                        <TextInput editable={false} value={toRupiah(formData.taxPengirim, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
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
    },
    textAreaContainer: {
        marginVertical: 10,
        elevation: 1,
        paddingHorizontal: 5
    },
    textArea: {
        textAlignVertical: "top",
        height: 100,
        justifyContent: "flex-start"
    }
})
