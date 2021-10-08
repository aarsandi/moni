import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import {useDispatch} from 'react-redux'
import {setupPlanAction} from '../../store/plan/function'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';

export default function SetupPlan() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [openBulanan, setOpenBulanan] = useState(false)
    
    const [inputNeeds, setInputNeeds] = useState(false)
    const [errorInput, setErrorInput] = useState(null)
    const [errorNeed, setErrorNeed] = useState(null)
    const [dataInput, setDataInput] = useState({ penghasilan: "", jumlahDitabung: "", uangHarian: "", uangBulanan: "0", uangLainnya: "", tanggalGajian: new Date()})
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
            const percPenghasilan = (Number(dataInput.penghasilan)/100)*10
            if(Number(dataInput.uangLainnya)>percPenghasilan) {
                const result = {
                    ...dataInput,
                    pengeluaranBulanan: monthlyNeeds
                }
                setupPlanAction(result, dispatch, (el) => {
                    if(el.message=="success") {
                        setErrorInput(null)
                        navigation.navigate("Plan")
                    }else{
                        setErrorInput("function error!")
                    }
                })
            }else{
                setErrorInput(`uang lainnya tidak boleh kurang dari 10 persen penghasilan`)
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
            }else{
                handleChangeInput(String(dataNeed.amount), 'uangBulanan')
            }
            setMonthlyNeeds([
                ...monthlyNeeds,
                { id: monthlyNeeds.length+1, title: dataNeed.title, amount: Number(dataNeed.amount), due_date: Date.parse(dataNeed.due_date) }
            ])
            setInputNeeds(false)
            setErrorNeed(null)
        }
    }

    useEffect(() => {
        if(dataInput.penghasilan!==""&&dataInput.jumlahDitabung!==""&&dataInput.uangBulanan!==""&&dataInput.uangHarian!=="") {
            let date = new Date();
            let time = new Date(date.getTime());
            time.setMonth(date.getMonth() + 1);
            time.setDate(0);
            let days =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
            const CalcUangSisa = (Number(dataInput.penghasilan)-Number(dataInput.jumlahDitabung)-Number(dataInput.uangBulanan))-(Number(dataInput.uangHarian)*(days+1))
            handleChangeInput(String(CalcUangSisa), 'uangLainnya')
        }
    }, [dataInput.penghasilan, dataInput.jumlahDitabung, dataInput.uangBulanan, dataInput.uangHarian])

    return (
        <View>
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Penghasilan :</Text>
            <MaskInput keyboardType='number-pad' 
                value={dataInput.penghasilan} onChangeText={(masked, unmasked, obfuscated) => { handleChangeInput(unmasked, 'penghasilan') }}
                mask={createNumberMask({
                  prefix: ['Rp.', ' '],
                  delimiter: ',',
                  precision: 3,
                })}
            />
            
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Tanggal Gajian :</Text>
            <View style={{flexDirection:'row', width: window.width, margin: 10, padding:4, alignItems:'center', justifyContent:'center', borderWidth:4, borderColor:'#888', borderRadius:10, backgroundColor:'#fff'}}>
                <View style={{flex:4}}>
                    <TextInput
                        style={{backgroundColor:'transparent'}}
                        editable={false} value={moment(dataInput.tanggalGajian).format("DD MMM YYYY")}
                    />
                </View>
                {
                    !open?
                    <View style={{flex:1}}>
                        <TouchableOpacity
                            onPress={() => setOpen(true)}
                            // style={ this.props.style } 
                        >
                            <Text>Open</Text>
                        </TouchableOpacity>
                    </View>:
                    <View style={{flex:1}}>
                        <TouchableOpacity
                            onPress={ () => setOpen(false) }
                            // style={ this.props.style } 
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <DatePicker modal open={open} date={dataInput.tanggalGajian} mode="date"
                onConfirm={(date) => {
                    setOpen(false)
                    handleChangeInput(date, 'tanggalGajian')
                }}
                onCancel={() => {
                    setOpen(false)
                    handleChangeInput(new Date(), 'tanggalGajian')
                }}
            />
            
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
            
            <Text style={ { fontSize: 15, fontWeight: 'bold' } }>Total Bulanan :</Text>
            {
                inputNeeds&&
                <>
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
                </>
            }
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
            <TextInput value={`Rp. ${dataInput.uangLainnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} keyboardType='number-pad' placeholder="Rp. 0"/>

            <TouchableOpacity onPress={ handleSubmitInput } style={ { backgroundColor:'#ea8685',marginHorizontal:20,padding:10 } }>
                <Text style={ { ...styles.buttonText, color: 'white' } }>Submit</Text>
            </TouchableOpacity>
            { 
                errorInput && <Text>{errorInput}</Text>
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
