import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, ToastAndroid, TouchableWithoutFeedback } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { toRupiah } from '../../helpers/NumberToString'

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CompFormSetupPlan({data, onSubmit, navigation}) {
    const { loan } = data

    // open modal date
    const [openGaji, setOpenGaji] = useState(false)
    const [openBulanan, setOpenBulanan] = useState(false)
    // open modal needs
    const [inputNeeds, setInputNeeds] = useState(false)

    // data
    const [dataInput, setDataInput] = useState({ type:"", uangTotal: "", jumlahDitabung: "", uangHarian: "", uangBulanan: "0", uangLainnya: "", tanggalGajian: new Date()})
    const [dataNeed, setDataNeed] = useState({ title: "", amount: "", due_date: new Date() })
    const [monthlyNeeds, setMonthlyNeeds] = useState([])

    const handleSubmit = () => {
        const findEmpty = Object.keys(dataInput).find((el) => dataInput[el]==="")
        if(findEmpty) {
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            const result = { 
                type: dataInput.type,
                uangTotal: Number(dataInput.uangTotal),
                jumlahDitabung: Number(dataInput.jumlahDitabung),
                uangHarian: Number(dataInput.uangHarian),
                tanggalGajian: Date.parse(dataInput.tanggalGajian),
                uangLainnya: Number(dataInput.uangLainnya),
                pengeluaranBulanan:monthlyNeeds
            }
            if(result.uangLainnya<0) {
                ToastAndroid.show('uang lainnya tidak boleh kurang dari 0', ToastAndroid.SHORT)
            }else{
                onSubmit(result)
            }
        }
    }

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action)
        })
    },[navigation]);
    
    React.useLayoutEffect(() => {
        if(dataInput.type!==""&&dataInput.uangTotal!==""&&dataInput.jumlahDitabung!==""&&dataInput.uangHarian!==""&&dataInput.uangBulanan!==""&&dataInput.uangLainnya!=="") {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={{ color: 'white', fontSize: 18, paddingRight: 10 }}>Create</Text>
                    </TouchableOpacity>
                ),
            });
        }else{
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity disabled={true}>
                        <Text style={{ color: 'grey', fontSize: 18, paddingRight: 10 }}>Create</Text>
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, dataInput.type, dataInput.uangTotal, dataInput.jumlahDitabung, dataInput.uangHarian, dataInput.uangBulanan, dataInput.uangLainnya ]);

    const handleChangeInput = (value, field) => {
        setDataInput({
            ...dataInput,
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
            ToastAndroid.show(`harap isi field ${findEmpty}`, ToastAndroid.SHORT)
        } else {
            if(Number(dataInput.uangBulanan)) {
                const result = Number(dataNeed.amount)+Number(dataInput.uangBulanan)
                handleChangeInput(String(result), 'uangBulanan')
                setMonthlyNeeds([
                    ...monthlyNeeds,
                    { id: monthlyNeeds[monthlyNeeds.length-1].id+1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                ])
            }else{
                handleChangeInput(String(dataNeed.amount), 'uangBulanan')
                setMonthlyNeeds([
                    ...monthlyNeeds,
                    { id: 1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
                ])
            }
            setInputNeeds(false)
            setDataNeed({ title: "", amount: "", due_date: new Date() })
        }
    }

    const handleSubmitManyNeeds = (el) => {
        let totalAmount = 0
        let needs = []
        for (let i = 0; i < el.length; i++) {
            totalAmount = totalAmount+el[i].amountPay[0].amount
            needs = [
                ...needs,
                {id: i, title:el[i].title, amount:el[i].amountPay[0].amount, due_date:el[i].due_date}
            ]
        }
        setMonthlyNeeds([
            ...monthlyNeeds,
            ...needs
        ])
        const result = Number(dataNeed.amount)+totalAmount
        handleChangeInput(String(result), 'uangBulanan')
    }

    const handleDeleteNeeds = (id, amount) => {
        const result = Number(dataInput.uangBulanan)-Number(amount)
        handleChangeInput(String(result), 'uangBulanan')
        setMonthlyNeeds(monthlyNeeds.filter(el => el.id !== id))
    }

    useEffect(() => {
        if(dataInput.uangTotal!==""&&dataInput.jumlahDitabung!==""&&dataInput.uangBulanan!==""&&dataInput.uangHarian!=="") {
            let date = new Date();
            let time = new Date(date.getTime());
            time.setMonth(date.getMonth() + 1);
            time.setDate(0);
            let days =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
            const CalcUangSisa = (Number(dataInput.uangTotal)-Number(dataInput.jumlahDitabung)-Number(dataInput.uangBulanan))-(Number(dataInput.uangHarian)*(days+1))
            handleChangeInput(String(CalcUangSisa), 'uangLainnya')
        }
    }, [dataInput.uangTotal, dataInput.jumlahDitabung, dataInput.uangBulanan, dataInput.uangHarian])

    useEffect(() => {
        if(dataInput.type==="Bulanan") {
            const nowDate = new Date()
            handleChangeInput(new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0, 23), 'tanggalGajian')
        }else{
            handleChangeInput(new Date(), 'tanggalGajian')
        }
    }, [dataInput.type])

    useEffect(() => {
        if(!monthlyNeeds.length&&loan.length&&dataInput.type!=="") {
            Alert.alert("Warning", "Anda memiliki pembayaran Hutang bulan ini, apa ingin memasukkannya ke plan ?", [
                {
                    text: "Ok",
                        onPress: () => {
                            handleSubmitManyNeeds(loan)
                        },
                    style: "ok",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ], { cancelable:true })
        }
    }, [dataInput.type])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.formTitle}>Tipe Plan*</Text>
            <SelectDropdown defaultButtonText="Choose Plan" buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                data={["Gaji", "Bulanan"]} onSelect={(selectedItem) => { handleChangeInput(selectedItem, 'type') }}/>
            {
                dataInput.type!==""&&
                <>
                    {
                        dataInput.type==="Gaji"&&
                        <>
                            <Text style={ styles.formTitle }>Tanggal Gajian :</Text>
                            <TouchableWithoutFeedback onPress={() => setOpenGaji(true)}>
                                <View><View pointerEvents="none">
                                    <TextInput
                                        style={styles.formInput}
                                        value={moment(dataInput.tanggalGajian).format("DD MMM YYYY")}
                                        editable={false}
                                        placeholder={moment(dataInput.tanggalGajian).format("DD MMM YYYY")}
                                    />
                                </View></View>
                            </TouchableWithoutFeedback>
                            <DatePicker modal open={openGaji} date={dataInput.tanggalGajian} mode="date"
                                onConfirm={(date) => {
                                    setOpenGaji(false)
                                    handleChangeInput(date, 'tanggalGajian')
                                }}
                                onCancel={() => {
                                    setOpenGaji(false)
                                }}
                            />
                        </>
                    }
                    <View style={{flexDirection:'row' }}>
                        <View style={{flex:1, paddingRight: 10}}>
                            <Text style={styles.formTitle}>Penghasilan Perbulan</Text>
                            <MaskInput keyboardType='number-pad' style={styles.formInput}
                                value={dataInput.uangTotal} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'uangTotal') }}
                                mask={createNumberMask({
                                prefix: ['Rp.', ' '],
                                delimiter: ',',
                                precision: 3,
                                })}
                            />
                            
                            <Text style={ styles.formTitle }>Jumlah Ditabung</Text>
                            <MaskInput keyboardType='number-pad'  style={styles.formInput}
                                value={dataInput.jumlahDitabung} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'jumlahDitabung') }}
                                mask={createNumberMask({
                                prefix: ['Rp.', ' '],
                                delimiter: ',',
                                precision: 3,
                                })}
                            />

                            <Text style={ styles.formTitle }>Uang Harian</Text>
                            <MaskInput keyboardType='number-pad' style={styles.formInput}
                                value={dataInput.uangHarian} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'uangHarian') }}
                                mask={createNumberMask({
                                prefix: ['Rp.', ' '],
                                delimiter: ',',
                                precision: 3,
                                })}
                            />
                        </View>

                        <View style={{flex:1, marginLeft: 10}}>
                            <Text style={ styles.formTitle }>Total Bulanan</Text>
                            <TextInput style={{marginBottom: 14}} editable={false} value={toRupiah(dataInput.uangBulanan)} placeholder="Rp. 0"/>
                            <Text style={ styles.formTitle }>Uang Lainnya</Text>
                            <TextInput style={{marginBottom: 10}} editable={false} value={toRupiah(dataInput.uangLainnya)} placeholder="Rp. 0"/>
                        </View>
                    </View>

                    <View style={{marginTop:10, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#bee3db'}}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <Text style={{...styles.formTitle, flex:4}}>Monthly Spending Plan</Text>
                            {
                                !inputNeeds?
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => setInputNeeds(true)}>
                                    <Text style={{ fontSize: 18, paddingRight: 10 }}>Add</Text>
                                </TouchableOpacity>:
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                                    setDataNeed({ title: "", amount: "", due_date: new Date() })
                                    setInputNeeds(false) 
                                }}>
                                    <Text style={{ fontSize: 18, paddingRight: 10 }}>Cancel</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        {
                            inputNeeds?
                            <>
                                <Text style={ styles.formTitle }>Title :</Text>
                                <TextInput onChangeText={text => handleChangeNeed(text, 'title')} placeholder="Title" style={styles.formInput} placeholderTextColor="#838383" />
                                
                                <View style={{flexDirection:'row' }}>
                                    <View style={{ flex:1, paddingRight: 10 }}>
                                        <Text style={ styles.formTitle }>Jumlah</Text>
                                        <MaskInput keyboardType='number-pad' style={styles.formInput}
                                            value={dataNeed.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChangeNeed(unmasked, 'amount') }}
                                            mask={createNumberMask({
                                                prefix: ['Rp.', ' '],
                                                delimiter: ',',
                                                precision: 3,
                                            })}
                                        />
                                    </View>
                                    <View style={{ flex:1, paddingLeft: 10 }}>
                                        <Text style={ styles.formTitle }>Batas Waktu</Text>
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
                                                handleChangeNeed(date, 'due_date')
                                            }}
                                            onCancel={() => {
                                                setOpenBulanan(false)
                                            }}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity onPress={handleSubmitNeeds} style={ { backgroundColor: '#31572c', padding: 10, borderRadius: 10 } }>
                                    <Text style={{ color: '#bee3db', fontSize: 15, alignSelf: 'center' }}>Add monthly Spending</Text>
                                </TouchableOpacity>
                            </>:
                            <>
                            {
                                monthlyNeeds.length?monthlyNeeds.map((el, index) => {
                                    return(
                                        <View key={index} style={{flexDirection:'row', paddingTop: 20, paddingBottom: 10, borderColor:'#bee3db', borderBottomWidth: 3}}>
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
                                <Text style={{ alignSelf: 'center', marginTop: 20, fontSize: 15, fontWeight: '400' }}>there's no plan yet</Text>
                            }
                            </>
                        }
                    </View> 
                </>
            }
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
