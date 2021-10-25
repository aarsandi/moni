import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { useIsFocused } from "@react-navigation/native";
import { toRupiah } from '../../helpers/NumberToString'
import { leftDaysinMonth } from '../../helpers/calcDate'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { fetchPlan, updatePlan } from '../../store/plan/function'
import { fetchFinance } from '../../store/finance/function'
import { fetchHistPeng } from '../../store/historyPengeluaran/function'

export default function Home({ navigation }) {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { isDarkMode } = useSelector((state) => state.appReducer)
    const [thisMonthLoan,setThisMonthLoan]=useState([])
    const [todayHistPeng,setTodayHistPeng]=useState({
        total: 0,
        date: new Date,
        data: []
    })
    const { nama, amountTabungan, amountDompet, amountRealDompet, loan } = useSelector((state) => state.financeReducer)
    const { status,uangTotal } = useSelector((state) => state.planReducer)
    const dataHistPeng = useSelector((state) => state.historyPengeluaranReducer.allData)
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(nama===null, amountTabungan===null, amountDompet===null, amountRealDompet===null) {
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
        if(status) {
            if(uangTotal<=0) {
                updatePlan(dispatch, {status:"failed"}, (el) => {
                    if(el.message !== "success") {
                        Alert.alert("Error", "Error Function", [], { cancelable:true })
                    }
                })
            }
        }
    }, [])

    useEffect(() => {
        if(loan.length){
            const nowDate = new Date().getMonth();
            const thisMonthLoan = loan.filter((el) => new Date(el.due_date).getMonth() === nowDate)
            setThisMonthLoan(thisMonthLoan)
        }
        if(dataHistPeng){
            let time = new Date().setHours(0, 0, 0, 0e2)
            const todayPeng = dataHistPeng.filter((el) => el.date >= time)
            const resTot = dataHistPeng.reduce(function (accumulator, item) {
                return accumulator + (item.amount+item.tax);
            }, 0)
            setTodayHistPeng({
                total: resTot,
                date: time,
                data: todayPeng
            })
        }
    }, [])

    return (
        <View style={{ backgroundColor: isDarkMode, flex: 1, flexDirection:'column' }}>
            <StatusBar
                backgroundColor='#14213d'
                barStyle='light-content'
            />
            <View style={{backgroundColor: "#14213d", padding: 10 }}>
                <View style={{flexDirection:'row', paddingVertical: 8 }}>
                    <View style={{flex: 2, paddingLeft: 10, justifyContent: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: "500" }}>SAVING ACCOUNT</Text>
                    </View>
                    <View style={{flex: 3, paddingLeft: 10, alignItems: 'flex-end'}}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>{toRupiah(amountTabungan, "Rp. ")}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingVertical: 8 }}>
                    <View style={{flex: 2, paddingLeft: 10, justifyContent: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: "500" }}>WALLET ACCOUNT</Text>
                    </View>
                    <View style={{flex: 3, paddingLeft: 10, alignItems: 'flex-end'}}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>{toRupiah(amountDompet, "Rp. ")}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingVertical: 8 }}>
                    <View style={{flex: 2, paddingLeft: 10, justifyContent: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: "500" }}>CASH</Text>
                    </View>
                    <View style={{flex: 3, paddingLeft: 10, alignItems: 'flex-end'}}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>{toRupiah(amountRealDompet, "Rp. ")}</Text>
                    </View>
                </View>
            </View>
            <View style={{backgroundColor: "#e5e5e5" }}>
                { !status?
                    <View style={{ margin: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: "500" }}>Anda Belum Mengaktifkan Finansial Plan</Text>
                        <TouchableOpacity onPress={()=> navigation.navigate("PlanScreenNavigator")} style={{ backgroundColor: '#8a8600', padding: 10, borderRadius: 10 }}>
                            <Text style={ { color: 'white', fontSize: 15, fontWeight: "bold", alignSelf: 'center' } }>Aktifkan Sekarang</Text>
                        </TouchableOpacity>
                    </View>:
                    <></>
                }
                <View style={{ flexDirection:'row' }}>
                    <TouchableOpacity style={{ padding: 10, flex: 2, alignItems:'center' }} onPress={() => { navigation.navigate("FormAmbilCash") }}>
                        <Text><Ionicons name="cash" color="#31572c" size={40} /></Text>
                        <Text style={{ fontWeight: '500' }}>take cash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10, flex: 2, alignItems:'center' }} onPress={() => { navigation.navigate("FormInputPenghasilan") }}>
                        <Text><Ionicons name="wallet" color="#31572c" size={40} /></Text>
                        <Text style={{ fontWeight: '500' }}>input income</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 10, flex: 2, alignItems:'center' }} onPress={() => { navigation.navigate("FormNabung", { isPlan: false }) }}>
                        <Text><Ionicons name="card" color="#31572c" size={40} /></Text>
                        <Text style={{ fontWeight: '500' }}>move to savings</Text>
                    </TouchableOpacity>
                </View>
            </View>
                
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <View style={{backgroundColor: "#bee3db", margin: 10, borderRadius: 5, padding: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 3, fontSize: 15, fontWeight: '800' }}>Upcoming Loan Payment</Text>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => navigation.navigate("FormLoan")}
                        >
                            <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>Add Loan</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        thisMonthLoan.length?thisMonthLoan.map((el, index) => {
                            return(
                                <View key={index} style={{flexDirection:'row', paddingTop: 10, paddingBottom: 5, borderColor:'#8e9399', borderBottomWidth: 1}}>
                                    <View style={{flex:4}}>
                                        <Text style={{ fontSize:15, fontWeight:"400" }}>{el.title}</Text>
                                        <Text style={{ fontSize:13, fontWeight:"300" }}>{moment(el.due_date).format("dddd, DD MMM")}</Text>
                                    </View>
                                    <View style={{flex:2}}>
                                        <Text style={{ fontSize:15, fontWeight:"400", textAlign: "right" }}>{el.amountPay[0]?toRupiah(el.amountPay[0].amount, "Rp. "):""}</Text>
                                        <TouchableOpacity
                                            onPress={ () => navigation.navigate("FormBayarHutang", {itemId: el.id})}
                                        >
                                            <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>Pay Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }):
                        <Text>you don't have yet</Text>
                    }
                </View>
                <TouchableOpacity onPress={ () => navigation.navigate("FormSpend") } style={{backgroundColor: '#31572c', padding: 10, borderRadius: 10, marginHorizontal: 10}}>
                    <Text style={ { color: '#bee3db', fontSize: 15, alignSelf: 'center' } }>Spending Form</Text>
                </TouchableOpacity>
                
                <View style={{backgroundColor: "#bee3db", margin: 10, borderRadius: 5, padding: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 3, fontSize: 15, fontWeight: '800' }}>Recent Spending</Text>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => navigation.navigate("HistoryScreenNavigator")}
                        >
                            <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>All Data</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        todayHistPeng.data.length?todayHistPeng.data.map((el, index) => {
                            return(
                                <View key={index} style={{flexDirection:'row', paddingTop: 10, paddingBottom: 5, borderColor:'#8e9399', borderBottomWidth: 1}}>
                                    <View style={{flex:4}}>
                                        <Text style={{ fontSize:15, fontWeight:"600" }}>{el.title}</Text>
                                        <Text style={{ fontSize:13, fontWeight:"300" }}>{moment(el.date).format('LT')}</Text>
                                    </View>
                                    <View style={{flex:2, alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize:15, fontWeight:"600" }}>{toRupiah(el.amount+el.tax, "Rp. ")}</Text>
                                        <Text style={{ fontSize:15, fontWeight:"800" }}>{el.type}</Text>
                                    </View>
                                </View>
                            )
                        }):
                        <Text>you don't have yet</Text>
                    }
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 3, fontSize: 15, fontWeight: '800' }}>Total</Text>
                        <Text style={{ flex: 1, color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>{toRupiah(todayHistPeng.total, "Rp. ")}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
