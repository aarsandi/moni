import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { setupPlanAction } from '../../store/plan/function'

import CompFormSetupPlan from '../../components/Form/CompFormSetupPlan'

export default function SetupPlan({ navigation }) {
    const dispatch = useDispatch()
    const [ loading, setLoading ]=useState(true)
    const [ thisMonthLoan, setThisMonthLoan ]=useState([])
    const { nama, loan } = useSelector((state) => state.financeReducer)

    const handleSubmit = (val) => {
        const {type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan,uangLainnya} = val
        if(type === "Payday") {
            let resTanggalGajian = new Date(tanggalGajian)
            resTanggalGajian.setMonth(resTanggalGajian.getMonth() + 1)
            const percPenghasilan = (uangTotal/100)*10
            if(uangLainnya>percPenghasilan) {
                setupPlanAction({type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian:Date.parse(resTanggalGajian),pengeluaranBulanan}, dispatch, (el) => {
                    if(el.message=="success") {
                        navigation.navigate("Plan")
                    }else{
                        Alert.alert("Error", "error function", [], { cancelable:true })
                    }
                })
            }else{
                Alert.alert("Warning", "other amount must more than 10% from your salary, are you sure to continue ?", [{
                    text: "Ok",
                    onPress: () => {              
                        setupPlanAction({type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan}, dispatch, (el) => {
                            if(el.message=="success") {
                                navigation.navigate("Plan")
                            }else{
                                Alert.alert("Error", "error function", [], { cancelable:true })
                            }
                        })
                    },
                    style: "ok",
                }], { cancelable:true })
            }
        } else {
            const percPenghasilan = (uangTotal/100)*10
            if(uangLainnya>percPenghasilan) {
                setupPlanAction({type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan}, dispatch, (el) => {
                    if(el.message=="success") {
                        navigation.navigate("Plan")
                    }else{
                        Alert.alert("Error", "error function", [], { cancelable:true })
                    }
                })
            }else{
                Alert.alert("Warning", "other amount must more than 10% from your salary, are you sure to continue ?", [{
                    text: "Ok",
                    onPress: () => {              
                        setupPlanAction({type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan}, dispatch, (el) => {
                            if(el.message=="success") {
                                navigation.navigate("Plan")
                            }else{
                                Alert.alert("Error", "error function", [], { cancelable:true })
                            }
                        })
                    },
                    style: "ok",
                }], { cancelable:true })
            }
        }
        
    }

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            if(loan.length){
                const nowDate = new Date().getMonth();
                const thisMonthLoan = loan.filter((el) => new Date(el.due_date).getMonth() === nowDate)
                setThisMonthLoan(thisMonthLoan)
            }
            setLoading(false)
        }
    }, [])

    return (
        <View>
            {loading?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 50 }}> ..... </Text>
            </View>:
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <CompFormSetupPlan data={{loan:thisMonthLoan}} onSubmit={handleSubmit} navigation={navigation}/>
            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
})
