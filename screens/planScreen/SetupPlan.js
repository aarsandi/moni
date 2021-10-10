import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import {toRupiah} from '../../helpers/NumberToString';
import SelectDropdown from 'react-native-select-dropdown'

import { setupPlanAction, fetchPlan } from '../../store/plan/function'
import { fetchFinance } from '../../store/finance/function'

export default function SetupPlan({ navigation }) {
    const dispatch = useDispatch()
    // reducer
    const { status, type } = useSelector((state) => state.planReducer)
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)

    // open modal date
    const [openGaji, setOpenGaji] = useState(false)
    const [openBulanan, setOpenBulanan] = useState(false)
    // open modal needs
    const [inputNeeds, setInputNeeds] = useState(false)

    // error input
    const [errorInput, setErrorInput] = useState(null)
    const [errorNeed, setErrorNeed] = useState(null)

    // data
    const [dataInput, setDataInput] = useState({ type:"", uangTotal: "", jumlahDitabung: "", uangHarian: "", uangBulanan: "0", uangLainnya: "", tanggalGajian: new Date()})
    const [dataNeed, setDataNeed] = useState({ title: "", amount: "", due_date: new Date() })
    const [monthlyNeeds, setMonthlyNeeds] = useState([])

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

    const handleSubmitInput = () => {
        const findEmpty = Object.keys(dataInput).find((el) => dataInput[el]==="")
        if(findEmpty) {
            setErrorInput(`harap isi field ${findEmpty}`)
        } else {
            const percPenghasilan = (Number(dataInput.uangTotal)/100)*10
            if(Number(dataInput.uangLainnya)>percPenghasilan) {
                const {type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan=monthlyNeeds} = dataInput                
                setupPlanAction({type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan}, dispatch, (el) => {
                    if(el.message=="success") {
                        setErrorInput(null)
                        navigation.navigate("Plan")
                    }else{
                        setErrorInput("function error!")
                    }
                })
            }else{
                setErrorInput(`uang lainnya tidak boleh kurang dari 10 persen uangTotal`)
            }
        }
    }

    const handleSubmitNeeds = () => {
        const findEmpty = Object.keys(dataNeed).find((el) => dataNeed[el]==="")
        if(findEmpty) {
            setErrorNeed(`harap isi field ${findEmpty}`)
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
            setErrorNeed(null)
        }
    }

    const handleDeleteNeeds = (id, amount) => {
        const result = Number(dataInput.uangBulanan)-Number(amount)
        handleChangeInput(String(result), 'uangBulanan')
        setMonthlyNeeds(monthlyNeeds.filter(el => el.id !== id))
    }

    useEffect(() => {
        if(type===null&&status===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message !== "success") {
                    navigation.navigate("Splash")
                }
            })
        }else{
            navigation.navigate("Plan")
        }
        if(amountRealDompet===null&&amountTabungan===null&&amountDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message !== "success") {
                    navigation.navigate("Splash")
                }
            })
        }
    }, [])

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

    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tipe Plan :</Text>
                <SelectDropdown data={["Gaji", "Bulanan"]} onSelect={(selectedItem) => { handleChangeInput(selectedItem, 'type') }}/>
                {
                    dataInput.type!==""&&
                    <>
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Penghasilan Perbulan :</Text>
                        <MaskInput keyboardType='number-pad' 
                            value={dataInput.uangTotal} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'uangTotal') }}
                            mask={createNumberMask({
                            prefix: ['Rp.', ' '],
                            delimiter: ',',
                            precision: 3,
                            })}
                        />
                        {
                            dataInput.type==="Gaji"&&
                            <>
                            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tanggal Gajian :</Text>
                            <View style={{flexDirection:'row', width: window.width, margin: 10, padding:4, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:'#888', borderRadius:10, backgroundColor:'#fff'}}>
                                <View style={{flex:4}}>
                                    <TextInput
                                        style={{backgroundColor:'transparent'}}
                                        editable={false} value={moment(dataInput.tanggalGajian).format("DD MMM YYYY")}
                                    />
                                </View>
                                {
                                    !openGaji?
                                    <View style={{flex:1}}>
                                        <TouchableOpacity
                                            onPress={() => setOpenGaji(true)}
                                            // style={ this.props.style } 
                                        >
                                            <Text>Open</Text>
                                        </TouchableOpacity>
                                    </View>:
                                    <View style={{flex:1}}>
                                        <TouchableOpacity
                                            onPress={ () => setOpenGaji(false) }
                                            // style={ this.props.style } 
                                        >
                                            <Text>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            <DatePicker modal open={openGaji} date={dataInput.tanggalGajian} mode="date"
                                onConfirm={(date) => {
                                    setOpenGaji(false)
                                    handleChangeInput(date, 'tanggalGajian')
                                }}
                                onCancel={() => {
                                    setOpenGaji(false)
                                    handleChangeInput(new Date(), 'tanggalGajian')
                                }}
                            />
                            </>
                        }
                        
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Jumlah yang ingin Ditabung :</Text>
                        <MaskInput keyboardType='number-pad' 
                            value={dataInput.jumlahDitabung} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'jumlahDitabung') }}
                            mask={createNumberMask({
                            prefix: ['Rp.', ' '],
                            delimiter: ',',
                            precision: 3,
                            })}
                        />

                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang Harian :</Text>
                        <MaskInput keyboardType='number-pad' 
                            value={dataInput.uangHarian} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'uangHarian') }}
                            mask={createNumberMask({
                            prefix: ['Rp.', ' '],
                            delimiter: ',',
                            precision: 3,
                            })}
                        />
                        {
                            inputNeeds&&
                            <View style={{marginVertical:10,padding:10,borderWidth:4,borderColor:'#888'}}>
                                <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Title :</Text>
                                <TextInput onChangeText={text => handleChangeNeed(text, 'title')} placeholder="Title" style={ styles.textInput } placeholderTextColor="#838383" />
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
                                    errorNeed && <Text>{errorNeed}</Text>
                                }
                                <TouchableOpacity onPress={handleSubmitNeeds} style={ { backgroundColor:'#ea8685',marginHorizontal:20,padding:10 } }>
                                    <Text style={ { ...styles.buttonText, color: 'white' } }>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        
                        {
                            monthlyNeeds.length?monthlyNeeds.map((el, index) => {
                                return(
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text key={index} style={{flex:4}}>{el.title} - {toRupiah(el.amount, "Rp. ")}</Text>
                                        <TouchableOpacity
                                            onPress={ () => handleDeleteNeeds(el.id, el.amount) }
                                            style={{flex:1}}
                                        >
                                            <Text>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                    )
                                }):
                                <Text></Text>
                        }
                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Total Bulanan :</Text>
                        <View style={{flexDirection:'row', width: window.width, margin: 10, padding:4, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:'#888', borderRadius:10, backgroundColor:'#fff'}}>
                            <View style={{flex:4}}>
                                <TextInput
                                    style={{backgroundColor:'transparent'}}
                                    placeholder="0"
                                    editable={false} value={dataInput.uangBulanan}
                                />
                            </View>
                            {
                                !inputNeeds?
                                <View style={{flex:1}}>
                                    <TouchableOpacity
                                        onPress={ () => setInputNeeds(true) }
                                        // style={ this.props.style }
                                    >
                                        <Text>Add</Text>
                                    </TouchableOpacity>
                                </View>:
                                <View style={{flex:1}}>
                                    <TouchableOpacity
                                        onPress={ () => {
                                            setDataNeed({ title: "", amount: "", due_date: new Date() })
                                            setInputNeeds(false) 
                                        }}
                                        // style={ this.props.style }
                                    >
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>

                        <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Uang Lainnya :</Text>
                        <TextInput editable={false} value={`Rp. ${dataInput.uangLainnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} placeholder="Rp. 0"/>

                        <TouchableOpacity onPress={ handleSubmitInput } style={ { backgroundColor:'#ea8685',marginHorizontal:20,padding:10 } }>
                            <Text style={ { ...styles.buttonText, color: 'white' } }>Submit</Text>
                        </TouchableOpacity>
                        { 
                            errorInput && <Text>{errorInput}</Text>
                        }
                    </>
                }
            </ScrollView>
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
