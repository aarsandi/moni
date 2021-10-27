import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFinance } from '../../store/finance/function'
import { fetchPlan } from '../../store/plan/function'
import { useIsFocused } from "@react-navigation/native";
import { leftDaysinMonth } from '../../helpers/calcDate'
import { toRupiah } from '../../helpers/NumberToString'
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

export default function Plan({ navigation }) {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,type,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)

    const [isLoading,setIsLoading] = useState(true)

    const [dataFinance, setDataFinance] = useState({
        totalBulanan: 0,
        totalSisa: 0,
        totalHarian: 0,
        sisaHari: 0,
        jumlahDitabung: 0,
        uangTotal: 0
    })

    useEffect(() => {
        if(amountTabungan===null, amountDompet===null, amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message==="success") {
                    fetchPlan(dispatch)
                    setIsLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setIsLoading(false)
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
            if(pengeluaranBulanan.length) {
                const resTotBulanan = pengeluaranBulanan.reduce(function (accumulator, item) {
                    return accumulator + item.amount;
                }, 0)
                let calcFinance = {
                    totalBulanan: resTotBulanan,
                    totalSisa: 0,
                    totalHarian: 0,
                    sisaHari: 0,
                    jumlahDitabung: jumlahDitabung,
                    uangTotal: uangTotal,
                    tanggalGajian: tanggalGajian
                }
                const dateComp = type === "Payday" ? leftDaysinMonth(new Date(tanggalGajian)) : leftDaysinMonth()
                const resultTotalHarian = (uangHarian*dateComp)+uangHariIni
                calcFinance.sisaHari = dateComp+1
                calcFinance.totalHarian = resultTotalHarian
                calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                setDataFinance(calcFinance)
            }else{
                let calcFinance = {
                    totalBulanan: 0,
                    totalSisa: 0,
                    totalHarian: 0,
                    sisaHari: 0,
                    jumlahDitabung: jumlahDitabung,
                    uangTotal: uangTotal,
                    tanggalGajian: tanggalGajian
                }
                const dateComp = type === "Payday" ? leftDaysinMonth(new Date(tanggalGajian)) : leftDaysinMonth()
                const resultTotalHarian = (uangHarian*dateComp)+uangHariIni
                calcFinance.sisaHari = dateComp+1
                calcFinance.totalHarian = resultTotalHarian
                calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                setDataFinance(calcFinance)
            }
        }
    }, [isFocused])

    return (
        <View>
            {
                isLoading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading</Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    { !status?
                        <>
                            <View style={{ margin: 10 }}>
                                <Text style={{ fontSize: 17, fontWeight: "500" }}>Create Finansial Plan</Text>
                                <TouchableOpacity onPress={()=> navigation.navigate("SetupPlan")} style={{ backgroundColor: '#8a8600', padding: 10, borderRadius: 10 }}>
                                    <Text style={ { color: 'white', fontSize: 15, fontWeight: "bold", alignSelf: 'center' } }>Create Now</Text>
                                </TouchableOpacity>
                            </View>
                        </>:
                        <>
                            {
                                status!=="active"&&
                                <View style={{ margin: 10 }}>
                                    <Text style={{ fontSize: 17, fontWeight: "500" }}>Plan anda {status==="completed"?"sudah selesai":"gagal atau balance plan habis"}</Text>
                                    <TouchableOpacity onPress={()=> navigation.navigate("SetupPlan")} style={{ backgroundColor: '#8a8600', padding: 10, borderRadius: 10 }}>
                                        <Text style={ { color: 'white', fontSize: 15, fontWeight: "bold", alignSelf: 'center' } }>Create New Plan</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={{backgroundColor: "#bee3db", margin: 10, borderRadius: 5, padding: 10 }}>
                                <View style={{flexDirection:'row' }}>
                                    <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                                        <Text><Ionicons name="leaf" color="#31572c" size={30} /></Text>
                                    </View>
                                    <View style={{flex: 3, alignItems:'center', justifyContent:'center'}}>
                                        <Text style={{ fontSize: 12 }}>Plan Limit</Text>
                                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{dataFinance?toRupiah(dataFinance.uangTotal, "Rp. "):"Rp. 0"}</Text>
                                    </View>
                                    <View style={{flex: 3, alignItems:'center', justifyContent:'center'}}>
                                        <Text style={{ fontSize: 12 }}>Days Left</Text>
                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{dataFinance?`${dataFinance.sisaHari} remains days`:"-"}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection:'row', marginTop: 5, marginHorizontal: 10, padding:4, alignItems:'center' }}>
                                    <Text style={{ flex: 4 }}>Daily Amount</Text>
                                    <Text style={{ flex: 2 }}>{toRupiah(uangHariIni)}</Text>
                                </View>
                                <View style={{ flexDirection:'row', marginHorizontal: 10, padding:4, alignItems:'center' }}>
                                    <Text style={{ flex: 4 }}>Daily Limit</Text>
                                    <Text style={{ flex: 2 }}>{toRupiah(uangHarian)}</Text>
                                </View>
                                <View style={{ flexDirection:'row', marginTop: 5, marginHorizontal: 10, padding:4, alignItems:'center' }}>
                                    <Text style={{ flex: 4 }}>Monthly Amount</Text>
                                    <Text style={{ flex: 2 }}>{dataFinance?toRupiah(dataFinance.totalBulanan):"Rp. 0"}</Text>
                                </View>
                                <View style={{ flexDirection:'row', marginHorizontal: 10, padding:4, alignItems:'center' }}>
                                    <Text style={{ flex: 4 }}>Other Amount</Text>
                                    <Text style={{ flex: 2 }}>{dataFinance?toRupiah(dataFinance.totalSisa):"Rp. 0"}</Text>
                                </View>
                                <View style={{ flexDirection:'row', marginHorizontal: 10, padding:4, alignItems:'center' }}>
                                    <Text style={{ flex: 4 }}>Amount Saving</Text>
                                    <View style={{ flex: 2 }}>
                                        <Text>{dataFinance?toRupiah(dataFinance.jumlahDitabung):"Rp. 0"}</Text>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("FormNabung", { isPlan: true })}
                                        >
                                            <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13 }}>Tabung Sekarang</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={{backgroundColor: "#bee3db", margin: 10, borderRadius: 5, padding: 20 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ flex: 3, fontSize: 15, fontWeight: '800' }}>Upcoming Monthly Payment</Text>
                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={() => navigation.navigate('EditNeeds')}
                                    >
                                        <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>Edit Need</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    pengeluaranBulanan.length?pengeluaranBulanan.map((el, index) => {
                                        return(
                                            <View key={index} style={{flexDirection:'row', paddingTop: 10, paddingBottom: 5, borderColor:'#8e9399', borderBottomWidth: 1}}>
                                                <View style={{flex:4}}>
                                                    <Text style={{ fontSize:15, fontWeight:"500" }}>{el.title}{el.loanId?" (Loan)":""}</Text>
                                                    <Text style={{ fontSize:15, fontWeight:"400" }}>{toRupiah(el.amount, "Rp. ")}</Text>
                                                    <Text style={{ fontSize:13, fontWeight:"300" }}>{moment(el.due_date).format("DD MMM")}</Text>
                                                </View>
                                                {
                                                    el.loanId?
                                                    <View style={{flex:2}}>
                                                        <Text style={{ fontSize:15, fontWeight:"500", textAlign: "right" }}>{toRupiah(el.amount, "Rp. ")}</Text>
                                                        <TouchableOpacity
                                                            onPress={ () => navigation.navigate("FormBayarHutang", {itemId: el.loanId})}
                                                        >
                                                            <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>Pay Now</Text>
                                                        </TouchableOpacity>
                                                    </View>:
                                                    <View style={{flex:2}}>
                                                        <Text style={{ fontSize:15, fontWeight:"500", textAlign: "right" }}>{toRupiah(el.amount, "Rp. ")}</Text>
                                                        <TouchableOpacity
                                                            onPress={ () => navigation.navigate("FormSpend")}
                                                        >
                                                            <Text style={{ color: '#31572c', fontWeight:"700", fontSize: 13, textAlign: "right" }}>Pay Now</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            </View>
                                        )
                                    }):
                                    <></>
                                }
                            </View>
                        </>
                    }
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
