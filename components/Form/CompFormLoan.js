import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, TouchableWithoutFeedback } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'
import DatePicker from 'react-native-date-picker'
import moment from 'moment';

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
        taxPengirim: "",
        taxPenerima: "",
        amountTabunganAft: "",
        amountDompetAft: "",
        due_date: new Date()
    })

    const [error, setError] = useState(null)

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
                setError('kesalahan pada form balance')
            }
        }
    }

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
        handleChangeMany({ title: "", detail: "", amount: "", tenor: "", totalPerbulan: "", taxPengirim: "", taxPenerima: "", amountTabunganAft: "", amountDompetAft: ""})
    }, [formData.type])

    return (
        <View>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Type: </Text>
            <SelectDropdown data={["Cash", "Tabungan"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>

            { formData.type==="Cash"&&
                <>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Title:</Text>
                    <TextInput onChangeText={text => handleChange(text, 'title')} placeholder="Judul" placeholderTextColor="#838383" />

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Detail:</Text>
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

            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah:</Text>
            <MaskInput keyboardType='number-pad'
                value={formData.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amount") }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            {
                formData.type==="Tabungan"&&
                <>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tenor: </Text>
                    <SelectDropdown data={["1", "3", "6", "9"]} onSelect={(selectedItem) => {
                        handleChange(selectedItem, 'tenor') }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem+ " bulan"
                        }}
                        rowTextForSelection={(item) => {
                        return item+" bulan"
                    }}/>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Bayar Perbulan :</Text>
                    <TextInput editable={false} value={toRupiah(formData.totalPerbulan, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tabungan Setelahnya:</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChangeMany({amountTabunganAft:unmasked}) }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />

                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Rekening Setelahnya:</Text>
                    <MaskInput keyboardType='number-pad'
                        value={formData.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChangeMany({amountDompetAft:unmasked}) }}
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
                    setFormData({type: "",amount: ""})
                    navigation.navigate("Splash")
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
    },
    modalView: {
        width: 350,
        // height: 300,
        // margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        fontSize: 20, fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center"
    },
    textAreaContainer: {
        // borderColor: COLORS.grey20,
        borderWidth: 1,
        paddingHorizontal: 5
    },
    textArea: {
        textAlignVertical: "top",
        height: 100,
        justifyContent: "flex-start"
    }
})
