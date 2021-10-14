import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import {toRupiah} from '../../helpers/NumberToString';
import SelectDropdown from 'react-native-select-dropdown'

import { setupPlanAction } from '../../store/plan/function'
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
            Alert.alert("Warning", "Uang Lainnya Kurang dari 10 Persen dari Penghasilan, apakah anda yakin ?", [{
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
        if(amountRealDompet===null&&amountTabungan===null&&amountDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message === "success") {
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            if(loan.length){
                const nowDate = new Date().getMonth();
                const thisMonthLoan = loan.filter((el) => new Date(el.due_date).getMonth() === nowDate)
                setThisMonthLoan(thisMonthLoan)
                setLoading(false)
            }else{
                setLoading(false)
            }
        }
    }, [loan])

    return (
        <View>
            {loading?
            <Text>Loading...</Text>:
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <Text>Form Setup Plan</Text>
                <CompFormSetupPlan data={{amountTabungan, amountDompet, amountRealDompet, loan:thisMonthLoan}} onSubmit={handleSubmit} navigation={navigation}/>
            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
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
    elevation: 2
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
})
