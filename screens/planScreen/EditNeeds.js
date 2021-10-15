import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import {toRupiah} from '../../helpers/NumberToString';
import SelectDropdown from 'react-native-select-dropdown'

import { updatePlan, fetchPlan } from '../../store/plan/function'
import { fetchFinance } from '../../store/finance/function'
import { leftDaysinMonth } from '../../helpers/calcDate'

export default function EditNeeds({ navigation }) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)

    const [openBulanan, setOpenBulanan] = useState(false)
    const [openForm, setOpenForm] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const [dataFinance, setDataFinance] = useState({
        totalBulanan: 0,
        totalSisa: 0,
        totalHarian: 0,
        sisaHari: 0,
        jumlahDitabung: 0,
        uangTotal: 0
    })
    const [dataNeed, setDataNeed] = useState({ title: "", amount: "", due_date: new Date() })
    const [monthlyNeeds, setMonthlyNeeds] = useState([])

    const handleDeleteNeeds = (id, amount) => {
        const result = Number(dataFinance.totalBulanan)-Number(amount)
        handleChangeFinance(String(result), 'totalBulanan')
        setMonthlyNeeds(monthlyNeeds.filter(el => el.id !== id))
        let resultSubmit = monthlyNeeds.filter(el => el.id !== id)
        updatePlan(dispatch, {pengeluaranBulanan: resultSubmit}, (el) => {
            if(el==="success") {
                setError(null)
            }
        })
    }

    const handleChangeFinance = (value, field) => {
        setDataFinance({
            ...dataFinance,
            [field]: value
        })
    }

    const handleChangeNeed = (value, field) => {
        setDataNeed({
            ...dataNeed,
            [field]: value
        })
    }

    const handleSubmitNeeds = () => {
        const findEmpty = Object.keys(dataNeed).find((el) => dataNeed[el]==="")
        if(findEmpty) {
            setError(`harap isi field ${findEmpty}`)
        } else {
            let resultSubmit = monthlyNeeds
            if(dataFinance.totalSisa<dataNeed.amount){
                setError(`Uang sisa anda tidak cukup`)
            }else{
                if(Number(dataFinance.totalBulanan)) {
                    const result = Number(dataFinance.totalBulanan)+Number(dataNeed.amount)
                    handleChangeFinance(String(result), 'totalBulanan')
                    setMonthlyNeeds([
                        ...monthlyNeeds,
                        { id: monthlyNeeds[monthlyNeeds.length-1].id+1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                    ])
                    resultSubmit = [
                        ...monthlyNeeds,
                        { id: monthlyNeeds[monthlyNeeds.length-1].id+1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                    ]
                }else{
                    handleChangeFinance(String(dataNeed.amount), 'totalBulanan')
                    setMonthlyNeeds([
                        ...monthlyNeeds,
                        { id: 1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                    ])
                    resultSubmit = [
                        ...monthlyNeeds,
                        { id: 1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                    ]
                }
                setOpenForm(false)
                setDataNeed({ title: "", amount: "", due_date: new Date() })
                updatePlan(dispatch, {pengeluaranBulanan: resultSubmit}, (el) => {
                    if(el==="success") {
                        setError(null)
                    }
                })
            }
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
        if(status) {
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
    }, [status, uangTotal, pengeluaranBulanan])

    return (
        <View>
            { loading?
                <Text>Loading...</Text>:
                <View>
                    <ScrollView contentInsetAdjustmentBehavior="automatic" >
                        <Text>Update Pengeluaran Bulanan</Text>
                        <Text>Total Penghasilan: {dataFinance?dataFinance.uangTotal:0}</Text>
                        <Text>Total harian: {dataFinance?dataFinance.totalHarian:0}{dataFinance?` - ${dataFinance.sisaHari} remains days`:""}</Text>
                        <Text>Total bulanan: {dataFinance?dataFinance.totalBulanan:0}</Text>
                        <Text>Total sisa: {dataFinance?dataFinance.totalSisa:0}</Text>
                        {
                            monthlyNeeds.length?monthlyNeeds.map((el, index) => {
                                return(
                                    <View key={index} style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{flex:4}}>{el.title} - {toRupiah(el.amount, "Rp. ")}</Text>
                                        <TouchableOpacity
                                            onPress={ () => handleDeleteNeeds(el.id, el.amount) }
                                            style={{flex:1}}
                                        >
                                            <Text>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }):
                            <Text>No data</Text>
                        }
                        {
                            !openForm&&
                            <View style={{paddingVertical: 5}}>
                                <Button title="Tambah Pengeluaran Bulanan" onPress={() => setOpenForm(true)}/>
                            </View>
                        }
                        {
                            openForm&&
                            <>
                                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Title :</Text>
                                <TextInput onChangeText={text => handleChangeNeed(text, 'title')} placeholder="Title" placeholderTextColor="#838383" />
                                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah :</Text>
                                <MaskInput keyboardType='number-pad' 
                                    value={dataNeed.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChangeNeed(unmasked, 'amount') }}
                                    mask={createNumberMask({
                                        prefix: ['Rp.', ' '],
                                        delimiter: ',',
                                        precision: 3,
                                    })}
                                />
                                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Batas Waktu :</Text>
                                <View style={{flexDirection:'row', width: window.width, margin: 10, padding:4, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:'#888', borderRadius:10, backgroundColor:'#fff'}}>
                                    <View style={{flex:4}}>
                                        <TextInput
                                            style={{backgroundColor:'transparent'}}
                                            placeholder="-"
                                            editable={false} value={moment(dataNeed.due_date).format("DD MMM YYYY")}
                                        />
                                    </View>
                                    {
                                        !openBulanan?
                                        <View style={{flex:1}}>
                                            <TouchableOpacity
                                                onPress={() => setOpenBulanan(true)}
                                                // style={ this.props.style } 
                                            >
                                                <Text>Open</Text>
                                            </TouchableOpacity>
                                        </View>:
                                        <View style={{flex:1}}>
                                            <TouchableOpacity
                                                onPress={ () => setOpenBulanan(false) }
                                                // style={ this.props.style } 
                                            >
                                                <Text>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                                <DatePicker modal open={openBulanan} date={dataNeed.due_date} mode="date"
                                    onConfirm={(date) => {
                                        setOpenBulanan(false)
                                        handleChangeNeed(date, 'due_date')
                                    }}
                                    onCancel={() => {
                                        setOpenBulanan(false)
                                        handleChangeNeed(new Date(), 'due_date')
                                    }}
                                />
                                { 
                                    error && <Text style={{ color: "red" }}>error: {error}</Text>
                                }
                                <TouchableOpacity onPress={handleSubmitNeeds} style={ { backgroundColor:'#ea8685',marginHorizontal:20,padding:10 } }>
                                    <Text style={ { color: 'white' } }>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    setOpenForm(false)
                                    setDataNeed({ title: "", amount: "", due_date: new Date() })
                                }} style={ { backgroundColor:'#ea8685',marginHorizontal:20,padding:10 } }>
                                    <Text style={ { color: 'white' } }>Cancel</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </ScrollView>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
