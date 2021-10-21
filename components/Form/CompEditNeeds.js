import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, TouchableWithoutFeedback } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { toRupiah } from '../../helpers/NumberToString'
import { leftDaysinMonth } from '../../helpers/calcDate'

export default function CompEditNeeds({data, onSubmit, navigation}) {
    const { uangTotal, jumlahDitabung, uangHarian, uangHariIni, tanggalGajian, pengeluaranBulanan } = data

    const [openBulanan, setOpenBulanan] = useState(false)
    const [dataFinance, setDataFinance] = useState({
        totalBulanan: 0,
        totalSisa: 0,
        totalHarian: 0,
        sisaHari: 0,
        monthlyNeeds: pengeluaranBulanan
    })
    const [dataNeed, setDataNeed] = useState({ title: "", amount: "", due_date: new Date() })

    const handleDeleteNeeds = (id, amount) => {
        const result = Number(dataFinance.totalBulanan)-Number(amount)
        const newMonthlyNeeds = dataFinance.monthlyNeeds.filter(el => el.id !== id)
        handleChangeFinance({totalBulanan: String(result), monthlyNeeds: newMonthlyNeeds})
    }

    const handleChangeFinance = (value) => {
        setDataFinance({
            ...dataFinance,
            ...value
        })
    }

    const handleChangeNeed = (value) => {
        setDataNeed({
            ...dataNeed,
            ...value
        })
    }

    const handleSubmitNeeds = () => {
        const findEmpty = Object.keys(dataNeed).find((el) => dataNeed[el]==="")
        if(findEmpty) {
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            if(dataFinance.totalSisa<dataNeed.amount){
                ToastAndroid.show('Uang sisa anda tidak cukup', ToastAndroid.SHORT)
            }else{
                if(Number(dataFinance.totalBulanan)) {
                    const result = Number(dataFinance.totalBulanan)+Number(dataNeed.amount)
                    handleChangeFinance({totalBulanan: String(result), monthlyNeeds: [
                        ...dataFinance.monthlyNeeds,
                        { id: dataFinance.monthlyNeeds[dataFinance.monthlyNeeds.length-1].id+1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                    ]})
                } else {
                    handleChangeFinance({totalBulanan: String(dataNeed.amount), monthlyNeeds: [
                        ...dataFinance.monthlyNeeds,
                        { id: 1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                    ]})
                }
            }
            setDataNeed({ title: "", amount: "", due_date: new Date() })
        }
    }
    
    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action)
        })
    },[navigation]);
    
    React.useEffect(() => {
        if(dataFinance.totalBulanan!==""&&dataFinance.totalSisa!==""&&dataFinance.totalHarian!==""&&dataFinance.sisaHari!==""&&dataFinance.monthlyNeeds!=="") {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => {onSubmit(dataFinance)}}>
                        <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Submit</Text>
                    </TouchableOpacity>
                ),
            });
        }else{
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity disabled={true}>
                        <Text style={{ color: 'grey', fontSize: 18, paddingRight: 10 }}>Submit</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, dataFinance.totalBulanan, dataFinance.totalSisa, dataFinance.totalHarian, dataFinance.sisaHari, dataFinance.monthlyNeeds]);
    
    useEffect(() => {
        if(dataFinance.monthlyNeeds.length) {
            const resTotBulanan = dataFinance.monthlyNeeds.reduce(function (accumulator, item) {
                return accumulator + item.amount;
            }, 0)
            let calcFinance = {
                totalBulanan: resTotBulanan,
                totalSisa: 0,
                totalHarian: 0,
                sisaHari: 0
            }
            
            const resultTotalHarian = (uangHarian*leftDaysinMonth(new Date(tanggalGajian)))+uangHariIni
            calcFinance.sisaHari = leftDaysinMonth(new Date(tanggalGajian))+1
            calcFinance.totalHarian = resultTotalHarian
            calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
            handleChangeFinance(calcFinance)
        }else{
            let calcFinance = {
                totalBulanan: 0,
                totalSisa: 0,
                totalHarian: 0,
                sisaHari: 0
            }
            const resultTotalHarian = (uangHarian*leftDaysinMonth(new Date(tanggalGajian)))+uangHariIni
            calcFinance.sisaHari = leftDaysinMonth(new Date(tanggalGajian))+1
            calcFinance.totalHarian = resultTotalHarian
            calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
            handleChangeFinance(calcFinance)
        }
    }, [dataFinance.monthlyNeeds])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <View style={{flexDirection:'row' }}>
                <View style={{flex:1, paddingRight: 10}}>
                    <Text style={styles.formTitle}>Total Penghasilan</Text>
                    <TextInput editable={false} value={toRupiah(uangTotal, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
                    <Text style={styles.formTitle}>Total harian {` - ${dataFinance.sisaHari} days`}</Text>
                    <TextInput editable={false} value={toRupiah(dataFinance.totalHarian, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
                </View>
                <View style={{flex:1, marginLeft: 10}}>
                    <Text style={styles.formTitle}>Total bulanan</Text>
                    <TextInput editable={false} value={toRupiah(dataFinance.totalBulanan, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
                    <Text style={styles.formTitle}>Total sisa</Text>
                    <TextInput editable={false} value={toRupiah(dataFinance.totalSisa, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
                </View>
            </View>
            <Text style={{...styles.formTitle, paddingBottom: 5}}>Pengeluaran Bulanan</Text>
            {
                dataFinance.monthlyNeeds.length?dataFinance.monthlyNeeds.map((el, index) => {
                    return(
                        <View key={index} style={{flexDirection:'row', paddingTop: 5, paddingBottom: 5, borderColor:'#bee3db', borderBottomWidth: 3}}>
                            <View style={{flex:4}}>
                                <Text style={{ fontSize:18, fontWeight:"500" }}>{el.title}</Text>
                                <Text>{moment(el.due_date).format("DD MMM")}</Text>
                            </View>
                            <View style={{flex:2, alignItems:'center'}}>
                                <Text style={{ fontSize:18, fontWeight:"500" }}>{toRupiah(el.amount, "Rp. ")}</Text>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#31572c', padding: 5, borderRadius: 10, width: 80 }}
                                    onPress={ () => handleDeleteNeeds(el.id, el.amount) }
                                >
                                    <Text style={{ color: '#bee3db', fontSize: 13, alignSelf: 'center' }}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }):
                <Text style={{ fontSize: 20, textAlign:'center', fontWeight: '700' }}>No Data</Text>
            }
            <Text style={{...styles.formTitle, paddingTop: 20}}>Tambah Pengeluaran Bulanan</Text>
            <View>
                <Text style={styles.formTitle}>Title</Text>
                <TextInput style={styles.formInput} value={dataNeed.title} onChangeText={text => handleChangeNeed({title: text})} placeholder="Title" placeholderTextColor="#838383" />
                <Text style={styles.formTitle}>Jumlah</Text>
                <MaskInput keyboardType='number-pad' style={styles.formInput}
                    value={dataNeed.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChangeNeed({amount:unmasked}) }}
                    mask={createNumberMask({
                        prefix: ['Rp.', ' '],
                        delimiter: ',',
                        precision: 3,
                    })}
                />
                <Text style={styles.formTitle}>Batas Waktu</Text>
                <TouchableWithoutFeedback onPress={() => setOpenBulanan(true)}>
                    <View><View pointerEvents="none">
                        <TextInput
                            style={styles.formInput}
                            value={moment(dataNeed.due_date).format("DD MMM YYYY")}
                            editable={false}
                            placeholder={moment(dataNeed.due_date).format("DD MMM YYYY")}
                        />
                    </View></View>
                </TouchableWithoutFeedback>
                <DatePicker modal open={openBulanan} date={dataNeed.due_date} mode="date"
                    onConfirm={(date) => {
                        setOpenBulanan(false)
                        handleChangeNeed({due_date:date})
                    }}
                    onCancel={() => {
                        setOpenBulanan(false)
                    }}
                />

                <TouchableOpacity onPress={ handleSubmitNeeds } style={{backgroundColor: '#31572c', padding: 10, borderRadius: 10}}>
                    <Text style={ { color: '#bee3db', fontSize: 15, alignSelf: 'center' } }>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    formInput: {
        borderBottomWidth: 2,
        borderColor:'#bee3db',
        marginBottom: 10
    },
    formTitle: {
        fontSize: 15,
        fontWeight: 'bold'
    }
})
