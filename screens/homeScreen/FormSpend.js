import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { toRupiah } from '../../helpers/NumberToString'

import { inputPengeluaran } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'
import { fetchPlan, updatePlan } from '../../store/plan/function';

import CompFormSpend from '../../components/Form/CompFormSpend';

export default function FormSpend({ navigation }) {
    const dispatch = useDispatch()
    const [ loading, setLoading ] = useState(true)
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status, pengeluaranBulanan, uangTotal, uangHariIni, uangHarian } = useSelector((state) => state.planReducer)

    const handleSubmit = (val) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                const result = {...val, amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet}
                
                let resultPlan
                const tempAmount = result.amount+result.tax
                if(result.type==="Bulanan"){
                    if(result.selectedPengBul) {
                        inputPengeluaran(dispatch, result, (el) => {
                            if(el.message === "success"&&result.payWith!=="Rekening Tabungan") {                                
                                if(status){
                                    resultPlan={
                                        uangTotal:uangTotal-tempAmount,
                                        pengeluaranBulanan:pengeluaranBulanan.filter(el => el.id !== result.selectedPengBul.id)
                                    }
                                    updatePlan(dispatch, resultPlan, (el) => {
                                        if(el.message==="success"){
                                            navigation.navigate("Splash")
                                        }else{
                                            Alert.alert("Error", "error function", [], { cancelable:true })
                                        }
                                    })
                                }else{
                                    navigation.navigate("Splash")
                                }
                            } else {
                                Alert.alert("Error", "error function", [], { cancelable:true })
                            }
                        })
                    }else{
                        Alert.alert("Error", "Pilih Item Terlebih Dahulu", [], { cancelable:true })
                    }
                }else if(result.type==="Harian"){                    
                    if(status && (uangHariIni+tempAmount)>uangHarian){
                        Alert.alert("Warning", "anda sudah melebihi batas harian, apakah anda yakin ?", [{
                            text: "Ok",
                            onPress: () => {
                                inputPengeluaran(dispatch, result, (el) => {
                                    if(el.message === "success") {
                                        if(status&&result.payWith!=="Rekening Tabungan"){
                                            resultPlan={
                                                uangTotal:uangTotal-tempAmount,
                                                uangHariIni:uangHariIni+tempAmount
                                            }
                                            updatePlan(dispatch, resultPlan, (el) => {
                                                if(el.message==="success"){
                                                    navigation.navigate("Splash")
                                                }else{
                                                    Alert.alert("Error", "error function", [], { cancelable:true })
                                                }
                                            })
                                        }else{
                                            navigation.navigate("Splash")
                                        }
                                    } else {
                                        Alert.alert("Error", "error function", [], { cancelable:true })
                                    }
                                })
                            },
                            style: "ok",
                        }], { cancelable:true })
                    }else{
                        inputPengeluaran(dispatch, result, (el) => {
                            if(el.message === "success") {
                                if(status&&result.payWith!=="Rekening Tabungan"){
                                    resultPlan={
                                        uangTotal:uangTotal-tempAmount,
                                        uangHariIni:uangHariIni+tempAmount
                                    }
                                    updatePlan(dispatch, resultPlan, (el) => {
                                        if(el.message==="success"){
                                            navigation.navigate("Splash")
                                        }else{
                                            Alert.alert("Error", "error function", [], { cancelable:true })
                                        }
                                    })
                                }else{
                                    navigation.navigate("Splash")
                                }
                            } else {
                                Alert.alert("Error", "error function", [], { cancelable:true })
                            }
                        })
                    }
                }else{
                    inputPengeluaran(dispatch, result, (el) => {
                        if(el.message === "success") {
                            if(status&&result.payWith!=="Rekening Tabungan"){
                                resultPlan={
                                    uangTotal:uangTotal-tempAmount
                                }
                                updatePlan(dispatch, resultPlan, (el) => {
                                    if(el.message==="success"){
                                        navigation.navigate("Splash")
                                    }else{
                                        Alert.alert("Error", "error function", [], { cancelable:true })
                                    }
                                })
                            }else{
                                navigation.navigate("Splash")
                            }
                        } else {
                            Alert.alert("Error", "error function", [], { cancelable:true })
                        }
                    })
                }
            },
            style: "ok",
        }], { cancelable:true })
    }

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
        if(uangTotal===null) {
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

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading</Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    <Text style={styles.modalText}>Pengeluaran</Text>
                    <CompFormSpend data={{amountTabungan, amountDompet, amountRealDompet, status, pengeluaranBulanan, uangTotal, uangHariIni, uangHarian}} onSubmit={handleSubmit} navigation={navigation}/>
                    
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
