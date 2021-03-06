import React, {useEffect,useState} from 'react'
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { inputPayLoan } from '../../store/app/function'

import CompFormPayLoan from '../../components/Form/CompFormPayLoan'

export default function FormBayarHutang({ route, navigation }) {
    const dispatch = useDispatch()
    const { itemId } = route.params;
    const { nama, amountTabungan, amountDompet, amountRealDompet, loan } = useSelector((state) => state.financeReducer)
    const { status,uangTotal,pengeluaranBulanan } = useSelector((state) => state.planReducer)
    const [ selectedLoan, setSelectedLoan ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const handleSubmit = (val) => {
        if(amountDompet&&amountRealDompet&&amountTabungan&&selectedLoan) {
            Alert.alert("Info", "are you sure?", [{
                text: "Ok",
                onPress: () => {
                    if(status==="active"&&pengeluaranBulanan.length) {
                        const findPengBul = pengeluaranBulanan.find((el) => {
                            return el.loanId === selectedLoan.id
                        })
                        if(findPengBul) {
                            inputPayLoan(dispatch, {
                                ...val,
                                amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet, selectedLoan: selectedLoan,
                                pengeluaranBulanan: pengeluaranBulanan.filter(el => el.id !== findPengBul.id), uangTotal: uangTotal
                            }, (el) => {
                                if(el.message === "success") {
                                    navigation.navigate("Splash")
                                }else{
                                    Alert.alert("Error", "Error Function", [], { cancelable:true })
                                }
                            })
                        }else{
                            inputPayLoan(dispatch, {
                                ...val,
                                amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet, selectedLoan: selectedLoan,
                                pengeluaranBulanan: null, uangTotal: null
                            }, (el) => {
                                if(el.message === "success") {
                                    navigation.navigate("Splash")
                                }else{
                                    Alert.alert("Error", "Error Function", [], { cancelable:true })
                                }
                            })
                        }
                    }else{
                        inputPayLoan(dispatch, {
                            ...val,
                            amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet, selectedLoan: selectedLoan,
                            pengeluaranBulanan: null, uangTotal: null
                        }, (el) => {
                            if(el.message === "success") {
                                navigation.navigate("Splash")
                            }else{
                                Alert.alert("Error", "Error Function", [], { cancelable:true })
                            }
                        })
                    }
                },
                style: "ok",
            }], { cancelable:true })        
        }else{
            Alert.alert("Error", "Error Function", [], { cancelable:true })
        }
    }

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        } else {
            if(loan.length&&itemId) {
                const findLoan = loan.find((el) => {
                    return el.id === itemId
                })
                if(findLoan) {
                    setSelectedLoan(findLoan)
                    setLoading(false)
                } else {
                    navigation.navigate("Splash")
                }
            } else {
                navigation.navigate("Splash")
            }
        }
    }, [itemId, loan])

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 50 }}> ..... </Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    {
                        selectedLoan&&
                        <CompFormPayLoan data={{amountDompet, amountRealDompet, amountTabungan, ...selectedLoan}} onSubmit={handleSubmit} navigation={navigation}/>
                    }
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
