import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { fetchFinance } from '../../store/finance/function'
import { inputPengeluaran } from '../../store/app/function'
import { updateDataPlan, updatePlan } from '../../store/plan/function'
import { toRupiah } from '../../helpers/NumberToString'
import { fetchPlan } from '../../store/plan/function';

export default function FormSpend({ navigation }) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status, pengeluaranBulanan, uangTotal, uangHariIni, uangHarian } = useSelector((state) => state.planReducer)
    const [selectedPengBul, setSelectedPengBul] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const payType = ["Cash", "Rekening Dompet", "Rekening Tabungan"]
    const [sisaBalance, setSisaBalance] = useState("")
    const [dataForm,setDataForm] = useState({
        title: "",
        detail: "",
        type: "",
        payWith: "",
        amount: ""
    })

    const handleChangeMany = (value) => {
        setDataForm({
            ...dataForm,
            ...value
        })
    }

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
                                balanceAfr: amountRealDompet-Number(dataForm.amount),
                                balanceBfr: amountRealDompet,
                                tax: 0,
                                date: new Date()
                            }
                            if(status){
                                let resultPlan
                                const tempAmount = Number(result.amount)+result.tax
                                if(result.type==="Bulanan"){
                                    if(selectedPengBul) {
                                        if(uangTotal<tempAmount) {
                                            Alert.alert("Error", "total uang plan anda tidak cukup", [], { cancelable:true })
                                        }else{
                                            resultPlan={
                                                uangTotal:uangTotal-tempAmount,
                                                pengeluaranBulanan:pengeluaranBulanan.filter(el => el.id !== selectedPengBul.id)
                                            }
                                            updatePlan(dispatch, resultPlan, (el) => {
                                                if(el.message!=="success"){
                                                    navigation.navigate("Splash")
                                                }else{
                                                    inputPengeluaran(dispatch, result, (el) => {
                                                        if(el.message === "success") {
                                                            navigation.navigate("Home")
                                                        } else {
                                                            Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                            navigation.navigate("Splash")
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }else{
                                        Alert.alert("Error", "Pilih Item Terlebih Dahulu", [], { cancelable:true })
                                    }
                                }else if(result.type==="Harian"){
                                    if(uangTotal<tempAmount) {
                                        Alert.alert("Error", "total uang plan anda tidak cukup", [], { cancelable:true })
                                    }else{
                                        resultPlan={
                                            uangTotal:uangTotal-tempAmount,
                                            uangHariIni:uangHariIni+tempAmount
                                        }
                                        if(uangHariIni+tempAmount>uangHarian){
                                            Alert.alert("Warning", "anda sudah melebihi batas harian, apakah anda yakin ?", [{
                                                text: "Ok",
                                                onPress: () => {
                                                    updatePlan(dispatch, resultPlan, (el) => {
                                                        if(el.message!=="success"){
                                                            navigation.navigate("Splash")
                                                        }else{
                                                            inputPengeluaran(dispatch, result, (el) => {
                                                                if(el.message === "success") {
                                                                    navigation.navigate("Home")
                                                                } else {
                                                                    Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                                    navigation.navigate("Splash")
                                                                }
                                                            })
                                                        }
                                                    })
                                                },
                                                style: "ok",
                                            }], { cancelable:true })
                                        }else{
                                            updatePlan(dispatch, resultPlan, (el) => {
                                                if(el.message!=="success"){
                                                    navigation.navigate("Splash")
                                                }else{
                                                    inputPengeluaran(dispatch, result, (el) => {
                                                        if(el.message === "success") {
                                                            navigation.navigate("Home")
                                                        } else {
                                                            Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                            navigation.navigate("Splash")
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }else{
                                    if(uangTotal<tempAmount) {
                                        Alert.alert("Error", "total uang plan anda tidak cukup", [], { cancelable:true })
                                    }else{
                                        resultPlan={
                                            uangTotal:uangTotal-(Number(dataForm.amount)+tax)
                                        }
                                        updatePlan(dispatch, resultPlan, (el) => {
                                            if(el.message!=="success"){
                                                navigation.navigate("Splash")
                                            }else{
                                                inputPengeluaran(dispatch, result, (el) => {
                                                    if(el.message === "success") {
                                                        navigation.navigate("Home")
                                                    } else {
                                                        Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                        navigation.navigate("Splash")
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }else{
                                inputPengeluaran(dispatch, result, (el) => {
                                    if(el.message === "success") {
                                        navigation.navigate("Home")
                                    } else {
                                        Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                        navigation.navigate("Splash")
                                    }
                                })
                            }
                        },
                        style: "ok",
                    }], { cancelable:true })
                }
            } else if(dataForm.payWith === "Rekening Dompet") {
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
                                    balanceAfr: amountDompet-(Number(dataForm.amount)+tax),
                                    balanceBfr: amountDompet,
                                    tax: tax,
                                    date: new Date()
                                }
                                if(status){
                                    let resultPlan
                                    const tempAmount = Number(result.amount)+result.tax
                                    if(result.type==="Bulanan"){
                                        if(selectedPengBul) {
                                            if(uangTotal<tempAmount) {
                                                Alert.alert("Error", "total uang plan anda tidak cukup", [], { cancelable:true })
                                            }else{
                                                resultPlan={
                                                    uangTotal:uangTotal-tempAmount,
                                                    pengeluaranBulanan:pengeluaranBulanan.filter(el => el.id !== selectedPengBul.id)
                                                }
                                                updatePlan(dispatch, resultPlan, (el) => {
                                                    if(el.message!=="success"){
                                                        navigation.navigate("Splash")
                                                    }else{
                                                        inputPengeluaran(dispatch, result, (el) => {
                                                            if(el.message === "success") {
                                                                navigation.navigate("Home")
                                                            } else {
                                                                Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                                navigation.navigate("Splash")
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }else{
                                            Alert.alert("Error", "Pilih Item Terlebih Dahulu", [], { cancelable:true })
                                        }
                                    }else if(result.type==="Harian"){
                                        if(uangTotal<tempAmount) {
                                            Alert.alert("Error", "total uang plan anda tidak cukup", [], { cancelable:true })
                                        }else{
                                            resultPlan={
                                                uangTotal:uangTotal-tempAmount,
                                                uangHariIni:uangHariIni+tempAmount
                                            }
                                            if(uangHariIni+tempAmount>uangHarian){
                                                Alert.alert("Warning", "anda sudah melebihi batas harian, apakah anda yakin ?", [{
                                                    text: "Ok",
                                                    onPress: () => {
                                                        updatePlan(dispatch, resultPlan, (el) => {
                                                            if(el.message!=="success"){
                                                                navigation.navigate("Splash")
                                                            }else{
                                                                inputPengeluaran(dispatch, result, (el) => {
                                                                    if(el.message === "success") {
                                                                        navigation.navigate("Home")
                                                                    } else {
                                                                        Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                                        navigation.navigate("Splash")
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    },
                                                    style: "ok",
                                                }], { cancelable:true })
                                            }else{
                                                updatePlan(dispatch, resultPlan, (el) => {
                                                    if(el.message!=="success"){
                                                        navigation.navigate("Splash")
                                                    }else{
                                                        inputPengeluaran(dispatch, result, (el) => {
                                                            if(el.message === "success") {
                                                                navigation.navigate("Home")
                                                            } else {
                                                                Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                                navigation.navigate("Splash")
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }else{
                                        if(uangTotal<tempAmount) {
                                            Alert.alert("Error", "total uang plan anda tidak cukup", [], { cancelable:true })
                                        }else{
                                            resultPlan={
                                                uangTotal:uangTotal-(Number(dataForm.amount)+tax)
                                            }
                                            updatePlan(dispatch, resultPlan, (el) => {
                                                if(el.message!=="success"){
                                                    navigation.navigate("Splash")
                                                }else{
                                                    inputPengeluaran(dispatch, result, (el) => {
                                                        if(el.message === "success") {
                                                            navigation.navigate("Home")
                                                        } else {
                                                            Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                                            navigation.navigate("Splash")
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }else{
                                    inputPengeluaran(dispatch, result, (el) => {
                                        if(el.message === "success") {
                                            navigation.navigate("Home")
                                        } else {
                                            Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                            navigation.navigate("Splash")
                                        }
                                    })
                                } 
                                
                            },
                            style: "ok",
                        }], { cancelable:true })
                    }
                    
                }
            } else if(dataForm.payWith === "Rekening Tabungan") {
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
                                    balanceAfr: amountTabungan-(Number(dataForm.amount)+tax),
                                    balanceBfr: amountTabungan,
                                    tax: tax,
                                    date: new Date()
                                }
                                inputPengeluaran(dispatch, result, (el) => {
                                    if(el.message === "success") {
                                        navigation.navigate("Home")
                                    } else {
                                        Alert.alert("Error", "Input Data Error", [], { cancelable:true })
                                        navigation.navigate("Splash")
                                    }
                                })
                            },
                            style: "ok",
                        }], { cancelable:true })
                    }
                    
                }
            } else {
                setError(`field pay with tidak ditemukan`)
            }
        }
    }

    useEffect(() => {
        if(selectedPengBul){
            handleChangeMany({title:selectedPengBul.title,amount:String(selectedPengBul.amount),detail:"-"})
        }
    }, [selectedPengBul])

    useEffect(() => {
        if(dataForm.type){
            setSelectedPengBul(null)
            handleChangeMany({
                title: "",
                detail: "",
                payWith: "",
                amount: ""
            })
        }
    }, [dataForm.type])

    useEffect(() => {
        if(amountTabungan===null&&amountDompet===null&&amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message === "success") {
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if(status===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message === "success") {
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setLoading(false)
        }
    }, [])

                                // ░░░░████░████░█████░█░░░█░████░██░░█░░░░
                                // ░░░░█░░█░█░░░░░░█░░░█░░░█░█░░█░███░█░░░░
                                // ░░░░████░███░░░░█░░░█░░░█░█░██░█░█░█░░░░
                                // ░░░░███░░█░░░░░░█░░░█░░░█░███░░█░█░█░░░░
                                // ░░░░█░█░░█░░░░░░█░░░██░██░█░█░░█░███░░░░
                                // ░░░░█░██░████░░░█░░░░███░░█░░█░█░░██░░░░

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading</Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    <Text style={styles.modalText}>Pengeluaran</Text>
                    <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Kategori Pengeluaran :</Text>
                    {
                        pengeluaranBulanan.length?
                        <SelectDropdown data={["Harian", "Bulanan", "Lainnya"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>:
                        <SelectDropdown data={["Harian", "Lainnya"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
                    }
                    {
                        dataForm.type==="Bulanan"?
                        <>
                            {
                                pengeluaranBulanan.map((el, index) => {
                                    return(
                                        <View key={index} style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{flex:4}}>{el.title} - {toRupiah(el.amount, "Rp. ")}</Text>
                                            { !selectedPengBul?
                                                (
                                                    <TouchableOpacity
                                                        onPress={ () => setSelectedPengBul(el) }
                                                        style={{flex:1}}
                                                    >
                                                        <Text>Select</Text>
                                                    </TouchableOpacity>
                                                ):(
                                                    el.id===selectedPengBul.id?
                                                    <TouchableOpacity
                                                        disabled={true}
                                                        style={{flex:1}}
                                                    >
                                                        <Text>Selected</Text>
                                                    </TouchableOpacity>:
                                                    <TouchableOpacity
                                                        style={{flex:1}}
                                                        onPress={ () => setSelectedPengBul(el) }
                                                    >
                                                        <Text>Select</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                            
                                        </View>
                                    )
                                })
                            }
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Title :</Text>
                            <TextInput editable={false} value={dataForm.title} placeholder="Judul" placeholderTextColor="#838383" />
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Detail :</Text>
                            <TextInput editable={false} value={dataForm.detail} placeholder="Detail" placeholderTextColor="#838383" />
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
                            <TextInput editable={false} value={toRupiah(dataForm.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Bayar dengan :</Text>
                            <SelectDropdown data={payType} onSelect={(selectedItem) => { handleChange(selectedItem, 'payWith') }}/>
                        </>:<>
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
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Bayar dengan :</Text>
                            <SelectDropdown data={payType} onSelect={(selectedItem) => { handleChange(selectedItem, 'payWith') }}/>
                        </>
                    }
                    {
                        dataForm.payWith === "Cash"&&
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Dompet cash : {toRupiah(amountRealDompet, 'Rp. ')}</Text>
                    }
                    {
                        dataForm.payWith === "Rekening Dompet"&&
                        <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Sisa Didompet :</Text>
                            <MaskInput keyboardType='number-pad'
                                value={sisaBalance} onChangeText={(masked, unmasked, obfuscated) => { setSisaBalance(unmasked) }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Dompet rekening : {toRupiah(amountDompet, 'Rp. ')}</Text>
                        </>
                    }
                    {
                        dataForm.payWith === "Rekening Tabungan"&&
                        <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Sisa Tabungan :</Text>
                            <MaskInput keyboardType='number-pad'
                                value={sisaBalance} onChangeText={(masked, unmasked, obfuscated) => { setSisaBalance(unmasked) }}
                                mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                            />
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tabungan : {toRupiah(amountTabungan, 'Rp. ')}</Text>
                        </>

                    }
                    {
                        error&&
                        <Text style={{ color: "red" }}>note: {error}</Text>
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
                            navigation.navigate("Splash")
                        }}
                    >
                        <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                </ScrollView>
            }
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
