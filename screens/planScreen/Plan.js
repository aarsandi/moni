import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFinance } from '../../store/finance/function'
import { fetchPlan } from '../../store/plan/function'
import { useIsFocused } from "@react-navigation/native";
import { leftDaysinMonth } from '../../helpers/calcDate'
import { toRupiah } from '../../helpers/NumberToString'

export default function Plan({ navigation }) {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)
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
                            <Text>Fitur Plan Anda Belum Aktif</Text>
                            <View style={{paddingVertical: 5}}>
                                <Button title="Setup Plan" onPress={() => navigation.navigate("SetupPlan")}/>
                            </View>
                        </>:
                        <>
                            {
                                status!=="active"&&
                                <View style={{marginVertical:10}}>
                                    <Text>Plan anda {status==="completed"?"sudah selesai":"gagal atau balance plan habis"}</Text>
                                    <Button title="Create New Plan" onPress={() => {
                                        navigation.navigate("PlanScreenNavigator", { screen: 'SetupPlan' })
                                    }} />
                                </View>
                            }
                            <Text>Total: {dataFinance?toRupiah(dataFinance.uangTotal, "Rp. "):"Rp. 0"}</Text>
                            <Text>jumlah Ditabung: {dataFinance?toRupiah(dataFinance.jumlahDitabung):"Rp. 0"}</Text>
                            <Text>Uang harian: {dataFinance?toRupiah(dataFinance.totalHarian):"Rp. 0"}{dataFinance?` - ${dataFinance.sisaHari} remains days`:""}</Text>
                            <Text>Uang bulanan: {dataFinance?toRupiah(dataFinance.totalBulanan):"Rp. 0"}</Text>
                            <Text style={{marginBottom:10}}>Uang sisa: {dataFinance?toRupiah(dataFinance.totalSisa):"Rp. 0"}</Text>

                            <Text>batas Harian: {toRupiah(uangHarian)}</Text>
                            <Text>pengeluaran hari ini: {toRupiah(uangHariIni)}</Text>

                            <View style={{margin:10}}>
                                <Text>Pengeluaran Bulanan: </Text>
                                {
                                    pengeluaranBulanan.length?pengeluaranBulanan.map((el, index) => {
                                        return(
                                            <View key={index}>
                                                <Text>{el.title} - {el.amount}</Text>
                                            </View>
                                        )
                                    }):
                                    <></>
                                }
                            </View>
    
                            <View style={{paddingVertical: 5}}>
                                <Button title="Edit Need" onPress={() => navigation.navigate('EditNeeds')}/>
                            </View>
                        </>
                        
                    }
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
