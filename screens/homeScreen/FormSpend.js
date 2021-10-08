import React, { useState } from 'react'
import { StyleSheet, Text, View, Modal, Pressable, TextInput, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { updateFinance } from '../../store/finance/function'
import { toRupiah } from '../../helpers/NumberToString'

export default function FormSpend({ navigation }) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const spendType = ["Harian", "Bulanan", "Lainnya"]
    const [error, setError] = useState(false)
    const payType = ["Cash", "Rekening Dompet", "Rekening Tabungan"]
    const [sisaBalance, setSisaBalance] = useState("")
    const [dataForm,setDataForm] = useState({
        title: "",
        detail: "",
        type: "",
        payWith: "",
        amount: ""
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
            setError(`harap isi field ${findEmpty}`)
        } else {
            if(dataForm.payWith === "Cash") {
                if(amountRealDompet<dataForm.amount) {
                    Alert.alert("Error", "Uang Anda Tidak Cukup", [], { cancelable:true })
                }else{
                    Alert.alert("Info", "are you sure?", [{
                        text: "Ok",
                        onPress: () => {
                            const result = {
                                ...dataForm,
                                tax: 0,
                                date: new Date()
                            }
                            updateFinance(dispatch, result, (el) => {
                                if(el.message === "success") {
                                    navigation.navigate("Home")
                                } else {
                                    Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                }
                            })
                        },
                        style: "ok",
                    }], { cancelable:true })
                }
            } else if(dataForm.payWith === "Rekening Dompet") {
                if(amountDompet<dataForm.amount) {
                    Alert.alert("Error", "Uang Anda Tidak Cukup", [], { cancelable:true })
                }else{
                    if(sisaBalance === "") {
                        setError("Sisa Balance Tidak Boleh Kosong")
                    } else {
                        const tax = (amountDompet-Number(dataForm.amount))-Number(sisaBalance)
                        if(tax<0) {
                            Alert.alert("Error", "Uang Anda Tidak Cukup", [], { cancelable:true })
                        } else {
                            Alert.alert("Info", "are you sure?", [{
                                text: "Ok",
                                onPress: () => {
                                    const result = {
                                        ...dataForm,
                                        tax: tax,
                                        date: new Date()
                                    }
                                    updateFinance(dispatch, result, (el) => {
                                        if(el.message === "success") {
                                            navigation.navigate("Home")
                                        } else {
                                            Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                        }
                                    })
                                },
                                style: "ok",
                            }], { cancelable:true })
                        }
                        
                    }
                }
            } else if(dataForm.payWith === "Rekening Tabungan") {
                if(amountTabungan<dataForm.amount) {
                    Alert.alert("Error", "Uang Anda Tidak Cukup", [], { cancelable:true })
                }else{
                    if(sisaBalance === "") {
                        setError("Sisa Balance Tidak Boleh Kosong")
                    } else {
                        const tax = (amountTabungan-Number(dataForm.amount))-Number(sisaBalance)
                        if(tax<0) {
                            Alert.alert("Error", "Uang Anda Tidak Cukup", [], { cancelable:true })
                        } else { 
                            Alert.alert("Info", "are you sure?", [{
                                text: "Ok",
                                onPress: () => {
                                    const result = {
                                        ...dataForm,
                                        tax: tax,
                                        date: new Date()
                                    }
                                    updateFinance(dispatch, result, (el) => {
                                        if(el.message === "success") {
                                            navigation.navigate("Home")
                                        } else {
                                            Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                        }
                                    })
                                },
                                style: "ok",
                            }], { cancelable:true })
                        }
                        
                    }
                }
            } else {

            }
        }
    }

    return (
        <View>
            <Text style={styles.modalText}>Pengeluaran</Text>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Title :</Text>
            <TextInput onChangeText={text => handleChange(text, 'title')} placeholder="Judul" placeholderTextColor="#838383" />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Detail :</Text>
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
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
            <MaskInput keyboardType='number-pad'
                value={dataForm.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amount') }}
                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
            />
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Kategori Pengeluaran :</Text>
            <SelectDropdown data={spendType} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Bayar dengan :</Text>
            <SelectDropdown data={payType} onSelect={(selectedItem) => { handleChange(selectedItem, 'payWith') }}/>
            {
                dataForm.payWith === "Cash"&&
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>dompet cash : {toRupiah(amountRealDompet, 'Rp. ')}</Text>
            }
            {
                dataForm.payWith === "Rekening Dompet"&&
                <>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Sisa Balance :</Text>
                    <MaskInput keyboardType='number-pad'
                        value={sisaBalance} onChangeText={(masked, unmasked, obfuscated) => { setSisaBalance(unmasked) }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>dompet rekening : {toRupiah(amountDompet, 'Rp. ')}</Text>
                </>
            }
            {
                dataForm.payWith === "Rekening Tabungan"&&
                <>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Sisa Balance :</Text>
                    <MaskInput keyboardType='number-pad'
                        value={sisaBalance} onChangeText={(masked, unmasked, obfuscated) => { setSisaBalance(unmasked) }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>tabungan : {toRupiah(amountTabungan, 'Rp. ')}</Text>
                </>

            }
            {
                error&&
                <Text style={{ color: "red" }}>{error}</Text>
            }
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => handleSubmit()}
            >
                <Text style={styles.textStyle}>Submit</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    setDataForm({title: "", detail: "", type: "", payWith: "", amount: "0", tax: "0", date: new Date()})
                }}
            >
                <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
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
});
