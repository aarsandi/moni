import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Alert, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'
import { leftDaysinMonth } from '../../helpers/calcDate'

import { fetchPlan, updatePlan } from '../../store/plan/function'

import PushNotification from "react-native-push-notification";

export default function Home({ navigation }) {
    const dispatch = useDispatch()
    const [dataFinance, setDataFinance] = useState({
        totalBulanan: 0,
        totalSisa: 0,
        totalHarian: 0,
        sisaHari: 0,
        jumlahDitabung: 0,
        uangTotal: 0
    })

    const { nama, amountTabungan, amountDompet, amountRealDompet, loan } = useSelector((state) => state.financeReducer)
    const { status,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan,updateCron } = useSelector((state) => state.planReducer)
    
    const handleNotif = (item) => {
        PushNotification.localNotification({
            channelId: "coba",
            title: "Click sukses",
            message: item,
            bigText: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
        })
    }
    
    // fetch and setup data plan
    useEffect(() => {
        fetchPlan(dispatch, (el) => {
                
        })
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
                const resultTotalHarian = (uangHarian*leftDaysinMonth(new Date(tanggalGajian)))+uangHariIni
                calcFinance.sisaHari = leftDaysinMonth(new Date(tanggalGajian))+1
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
                const resultTotalHarian = (uangHarian*leftDaysinMonth(new Date(tanggalGajian)))+uangHariIni
                calcFinance.sisaHari = leftDaysinMonth(new Date(tanggalGajian))+1
                calcFinance.totalHarian = resultTotalHarian
                calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                setDataFinance(calcFinance)
            }
        }
    }, [])

    return (
        <View>
            <Text>Selamat Datang {nama}</Text>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                { status?
                    <View style={{paddingVertical: 20}}>
                        <Text>Total: {dataFinance?toRupiah(dataFinance.uangTotal, "Rp. "):"Rp. 0"}</Text>
                        <Text>jumlah Ditabung: {dataFinance?toRupiah(dataFinance.jumlahDitabung):"Rp. 0"}</Text>
                        <Text>Uang harian: {dataFinance?toRupiah(dataFinance.totalHarian):"Rp. 0"}{dataFinance?` - ${dataFinance.sisaHari} remains days`:""}</Text>
                        <Text>Uang bulanan: {dataFinance?toRupiah(dataFinance.totalBulanan):"Rp. 0"}</Text>
                        <Text style={{marginBottom:10}}>Uang sisa: {dataFinance?toRupiah(dataFinance.totalSisa):"Rp. 0"}</Text>

                        <Text>batas Harian: {toRupiah(uangHarian)}</Text>
                        <Text>pengeluaran hari ini: {toRupiah(uangHariIni)}</Text>
                        <Text>updated at: {updateCron?new Date(updateCron).toLocaleString():"-"}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={{flex:4}}>Uang yang ingin ditabung: {toRupiah(jumlahDitabung, "Rp. ")}</Text>
                            {
                                jumlahDitabung>0&&
                                <View style={{flex:1, paddingVertical:5}}>
                                    <Button title="Tabung" onPress={() => {
                                        navigation.navigate("FormNabung", {
                                            isPlan: true
                                        })
                                    }}/>
                                </View>
                            }
                        </View>
                        {
                            status!=="active"&&
                            <>
                                <Text>Plan anda {status==="completed"?"sudah selesai":"gagal atau balance plan habis"}</Text>
                                <Button title="Create New Plan" onPress={() => {
                                    navigation.navigate("PlanScreenNavigator", { screen: 'SetupPlan' })
                                }} />
                            </>
                        }
                    </View>:
                    <View style={{paddingVertical: 20}}>
                        <Text>Anda Belum mengaktifkan finansial plan</Text>
                        <Button title="Aktifkan" onPress={() => {
                            navigation.navigate("PlanScreenNavigator", { screen: 'SetupPlan' })
                        }} />
                    </View>
                }

                <View style={{paddingVertical: 5}}>
                    <Text>tabungan: {amountTabungan}</Text>
                    <Text>uang rekening: {amountDompet}</Text>
                    <Text>uang cash: {amountRealDompet}</Text>
                </View>

                <View style={{paddingVertical: 5}}>
                    <Text>Loan Bill</Text>
                    {
                        loan.length?loan.map((el, index) => {
                            return(
                                <View key={index} style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={{flex:4}}>{moment(el.due_date).format("DD MMM")} - {toRupiah(el.amountPay[0].amount, "Rp. ")}</Text>
                                    <View style={{flex:1, paddingVertical:5}}>
                                        <Button title="Pay" onPress={() => {
                                            navigation.navigate("FormBayarHutang", {
                                                itemId: el.id
                                            })
                                        }}/>
                                    </View>
                                </View>
                            )
                        }):
                        <Text>You don't have any bill yet</Text>
                    }

                </View>

                <View style={{marginVertical:10}}>
                    <Button title="Coba Notif" onPress={() => {
                        handleNotif("coba")
                    }} />
                </View>

                <View style={{marginVertical:10}}>
                    <Button title="Ambil Cash" onPress={() => {
                        navigation.navigate("FormAmbilCash")
                    }} />
                </View>

                <View style={{marginVertical:10}}>
                    <Button title="Input Penghasilan" onPress={() => {
                        navigation.navigate("FormInputPenghasilan")
                    }} />
                </View>

                <View style={{marginVertical:10}}>
                    <Button title="Nabung" onPress={() => {
                        navigation.navigate("FormNabung", {
                            isPlan: false
                        })
                    }} />
                </View>

                <View style={{marginVertical:10}}>
                    <Button title="Input Pinjaman" onPress={() => {
                        navigation.navigate("FormLoan")
                    }} />
                </View>
                
                <View style={{marginVertical:10}}>
                    <Button title="Input Pengeluaran" onPress={() => {
                        navigation.navigate("FormSpend")
                    }} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
