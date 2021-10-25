import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { fetchPlan, setupPlanAction } from '../../store/plan/function'
import { fetchFinance } from '../../store/finance/function'

import CompFormSetupPlan from '../../components/Form/CompFormSetupPlan'

export default function SetupPlan({ navigation }) {
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(true)
    const [thisMonthLoan,setThisMonthLoan]=useState([])
    const { amountTabungan, amountDompet, amountRealDompet, loan } = useSelector((state) => state.financeReducer)

    const handleSubmit = (val) => {
        const {type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan,uangLainnya} = val
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

    useEffect(() => {
        if(amountTabungan===null, amountDompet===null, amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message==="success") {
                    fetchPlan(dispatch)
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
        if(loan.length){
            const nowDate = new Date().getMonth();
            const thisMonthLoan = loan.filter((el) => new Date(el.due_date).getMonth() === nowDate)
            setThisMonthLoan(thisMonthLoan)
        }
    }, [loan])

    return (
        <View>
            {loading?
            <Text>Loading...</Text>:
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <CompFormSetupPlan data={{loan:thisMonthLoan}} onSubmit={handleSubmit} navigation={navigation}/>
            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
})
