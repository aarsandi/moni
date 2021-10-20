import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import MaskInput, { createNumberMask }  from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown'
import { toRupiah } from '../../helpers/NumberToString'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CompFormSpend({data, onSubmit, navigation}) {
    const { amountTabungan, amountDompet, amountRealDompet, pengeluaranBulanan, status, planBulanan, planHarian, planLainnya } = data
    const [selectedPengBul, setSelectedPengBul] = useState(null)
    const [dataForm,setDataForm] = useState({ title: "", detail: "", type: "", payWith: "", amount: "", tax: "0", amountDompetAft: "", amountTabunganAft: "" })

    const handleChangeMany = (value) => {
        setDataForm({
            ...dataForm,
            ...value
        })
    }

    const handleChange = (value, field) => {
        setDataForm({
            ...dataForm,
            [field]: value
        })
    }
    
    const handleSubmit = async () => {
        if(Number(dataForm.tax)>=0) {
            const result = {
                title: dataForm.title,
                detail: dataForm.detail,
                type: dataForm.type,
                amount: Number(dataForm.amount),
                payWith: dataForm.payWith,
                tax: Number(dataForm.tax),
                amountTabunganAft: Number(dataForm.amountTabunganAft),
                amountDompetAft: Number(dataForm.amountDompetAft),
                selectedPengBul: selectedPengBul
            }
            const realAmount = result.amount+result.tax
            if(result.payWith === "Cash"&&amountRealDompet<=result.amount) {
                ToastAndroid.show('balance cash tidak cukup', ToastAndroid.SHORT)
            }else if(result.payWith === "Rekening Dompet"&&amountDompet<=realAmount) {
                ToastAndroid.show('balance rekening tidak cukup', ToastAndroid.SHORT)
            }else if(result.payWith === "Rekening Tabungan"&&amountTabungan<=realAmount) {
                ToastAndroid.show('balance tabungan tidak cukup', ToastAndroid.SHORT)
            }else if(status==="active"&&dataForm.type==="Harian"&&planHarian<realAmount) {
                ToastAndroid.show('balance plan tidak cukup', ToastAndroid.SHORT)
            }else if(status==="active"&&dataForm.type==="Bulanan"&&planBulanan<realAmount) {
                ToastAndroid.show('balance plan tidak cukup', ToastAndroid.SHORT)
            }else if(status==="active"&&dataForm.type==="Lainnya"&&planLainnya<realAmount) {
                ToastAndroid.show('balance plan tidak cukup', ToastAndroid.SHORT)
            }else{
                onSubmit(result)
            }
        } else {
            ToastAndroid.show('kesalahan pada form balance', ToastAndroid.SHORT)
        }
    }

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action)
        })
    },[navigation]);

    React.useEffect(() => {
        if(dataForm.title!==""&&dataForm.type!==""&&dataForm.payWith!==""&&dataForm.amount!==""&&dataForm.amountDompetAft!==""&&dataForm.amountTabunganAft!=="") {
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
    }, [navigation, dataForm.title, dataForm.type, dataForm.payWith, dataForm.amount, dataForm.amountDompetAft, dataForm.amountTabunganAft, dataForm.tax ]);

    useEffect(() => {
        if(dataForm.payWith === "Rekening Dompet"&&dataForm.amountDompetAft&&amountDompet&&dataForm.amount) {
            const tax = (amountDompet-Number(dataForm.amountDompetAft))-Number(dataForm.amount)
            handleChangeMany({tax: tax, amountTabunganAft: "0"})
        }
        if(dataForm.payWith === "Rekening Tabungan"&&dataForm.amountTabunganAft&&amountTabungan&&dataForm.amount) {
            const tax = (amountTabungan-Number(dataForm.amountTabunganAft))-Number(dataForm.amount)
            handleChangeMany({tax: tax, amountDompetAft: "0"})
        }
        if(dataForm.payWith === "Cash"&&dataForm.amount) {
            handleChangeMany({tax: "0", amountTabunganAft: "0", amountDompetAft: "0"})
        }
    }, [dataForm.amountDompetAft, dataForm.payWith, dataForm.amountTabunganAft, dataForm.amount])

    useEffect(() => {
        if(selectedPengBul){
            handleChangeMany({title:selectedPengBul.title,amount:String(selectedPengBul.amount),detail:"-"})
        }
    }, [selectedPengBul])

    useEffect(() => {
        if(dataForm.type){
            setSelectedPengBul(null)
            handleChangeMany({ title: "", detail: "", payWith: "", amount: "", tax: "0", amountDompetAft: "", amountTabunganAft: "" })
        }
    }, [dataForm.type])

    return (
        <View style={{paddingHorizontal:18, paddingTop: 18}}>
            <Text style={styles.formTitle}>Kategori Pengeluaran</Text>
            {
                pengeluaranBulanan.length?
                <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                    data={["Harian", "Bulanan", "Lainnya"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>:
                <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                    data={["Harian", "Lainnya"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'type') }}/>
            }
            {
                dataForm.type==="Bulanan"?
                <>
                    {
                        pengeluaranBulanan.map((el, index) => {
                            return(
                                <View key={index} style={{flexDirection:'row'}}>
                                    <Text style={{flex:4}}>{el.title} - {toRupiah(el.amount, "Rp. ")}</Text>
                                    { !selectedPengBul?
                                        (
                                            <TouchableOpacity
                                                onPress={ () => setSelectedPengBul(el) }
                                                style={{flex:1, alignItems: 'flex-end'}}
                                            >
                                                <Text style={{ fontWeight: "700" }}>Select</Text>
                                            </TouchableOpacity>
                                        ):(
                                            el.id===selectedPengBul.id?
                                            <TouchableOpacity
                                                disabled={true}
                                                style={{flex:1, alignItems: 'flex-end'}}
                                            >
                                                <Text style={{ fontWeight: "700" }}>Selected</Text>
                                            </TouchableOpacity>:
                                            <TouchableOpacity
                                                style={{flex:1, alignItems: 'flex-end'}}
                                                onPress={ () => setSelectedPengBul(el) }
                                            >
                                                <Text style={{ fontWeight: "700" }}>Select</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                    
                                </View>
                            )
                        })
                    }
                    <Text style={ { ...styles.formTitle, marginTop: 10 } }>Title</Text>
                    <TextInput style={styles.formInput} editable={false} value={dataForm.title} placeholder="Judul"/>

                    <Text style={styles.formTitle}>Detail</Text>
                    <TextInput style={styles.formInput} editable={false} value={dataForm.detail} placeholder="Detail" placeholderTextColor="#838383" />

                    <Text style={styles.formTitle}>Jumlah</Text>
                    <TextInput style={styles.formInput} editable={false} value={toRupiah(dataForm.amount, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383"/>

                    <Text style={styles.formTitle}>Bayar dengan</Text>
                    <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                         data={["Cash", "Rekening Dompet", "Rekening Tabungan"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'payWith') }}/>
                </>:<>
                    <Text style={styles.formTitle}>Title</Text>
                    <TextInput style={styles.formInput} onChangeText={text => handleChange(text, 'title')} placeholder="Judul" placeholderTextColor="#838383" />

                    <Text style={styles.formTitle}>Detail</Text>
                    <View style={styles.textAreaContainer} >
                        <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            numberOfLines={5}
                            multiline={true}
                            onChangeText={text => handleChange(text, 'detail')}
                        />
                    </View>
                    <Text style={styles.formTitle}>Jumlah</Text>
                    <MaskInput keyboardType='number-pad' style={styles.formInput}
                        value={dataForm.amount} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, 'amount') }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                    <Text style={styles.formTitle}>Bayar dengan</Text>
                    <SelectDropdown buttonStyle={{ width: '100%' }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={30} /></Text>}
                        data={["Cash", "Rekening Dompet", "Rekening Tabungan"]} onSelect={(selectedItem) => { handleChange(selectedItem, 'payWith') }}/>
                </>
            }
            {
                dataForm.payWith === "Cash"&&
                <>
                    <Text style={styles.formTitle}>Dompet cash : {toRupiah(amountRealDompet, 'Rp. ')}</Text>
                    {
                        status&&dataForm.type==="Harian"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planHarian)}</Text> 
                    }
                    {
                        status&&dataForm.type==="Bulanan"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planBulanan)}</Text>
                    }
                    {
                        status&&dataForm.type==="Lainnya"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planLainnya)}</Text>
                    }
                </>
            }
            {
                dataForm.payWith === "Rekening Dompet"&&
                <>
                    <Text style={styles.formTitle}>Sisa Didompet :</Text>
                    <MaskInput keyboardType='number-pad' style={styles.formInput}
                        value={dataForm.amountDompetAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountDompetAft") }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                    <Text style={styles.formTitle}>Dompet rekening : {toRupiah(amountDompet, 'Rp. ')}</Text>
                    {
                        status&&dataForm.type==="Harian"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planHarian)}</Text> 
                    }
                    {
                        status&&dataForm.type==="Bulanan"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planBulanan)}</Text>
                    }
                    {
                        status&&dataForm.type==="Lainnya"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planLainnya)}</Text>
                    }
                    <Text style={styles.formTitle}>Tax :</Text>
                    <TextInput editable={false} value={toRupiah(dataForm.tax, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
                </>
            }
            {
                dataForm.payWith === "Rekening Tabungan"&&
                <>
                    <Text style={styles.formTitle}>Sisa Tabungan :</Text>
                    <MaskInput keyboardType='number-pad' style={styles.formInput}
                        value={dataForm.amountTabunganAft} onChangeText={(masked, unmasked, obfuscated) => { handleChange(unmasked, "amountTabunganAft") }}
                        mask={createNumberMask({ prefix: ['Rp.', ' '], delimiter: ',', precision: 3 })}
                    />
                    <Text style={styles.formTitle}>Tabungan : {toRupiah(amountTabungan, 'Rp. ')}</Text>
                    {
                        status&&dataForm.type==="Harian"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planHarian)}</Text> 
                    }
                    {
                        status&&dataForm.type==="Bulanan"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planBulanan)}</Text>
                    }
                    {
                        status&&dataForm.type==="Lainnya"&& <Text style={styles.formTitle}>balance plan : {toRupiah(planLainnya)}</Text>
                    }
                    <Text style={styles.formTitle}>Tax :</Text>
                    <TextInput editable={false} value={toRupiah(dataForm.tax, "Rp. ")} placeholder="Rp. 0" placeholderTextColor="#838383" />
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
    },

    
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        fontSize: 20, fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center"
    },
    textAreaContainer: {
        marginVertical: 10,
        elevation: 1,
        paddingHorizontal: 5
    },
    textArea: {
        textAlignVertical: "top",
        height: 100,
        justifyContent: "flex-start"
    }
})
