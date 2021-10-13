import React, {useEffect,useState} from 'react'
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFinance } from '../../store/finance/function'
import { inputPayLoan } from '../../store/app/function'

import CompFormPayLoan from '../../components/Form/CompFormPayLoan'

export default function FormBayarHutang({ route, navigation }) {
    const dispatch = useDispatch()
    const { itemId } = route.params;
    const { amountTabungan, amountDompet, amountRealDompet, loan } = useSelector((state) => state.financeReducer)
    const [selectedLoan, setSelectedLoan] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleSubmit = (val) => {
        if(amountDompet&&amountRealDompet&&amountTabungan&&selectedLoan) {
            Alert.alert("Info", "are you sure?", [{
                text: "Ok",
                onPress: () => {
                    inputPayLoan(dispatch, {...val, amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet, selectedLoan: selectedLoan}, (el) => {
                        if(el.message === "success") {
                            navigation.navigate("Splash")
                        }else{
                            Alert.alert("Error", "Error Function", [], { cancelable:true })
                        }
                    })
                },
                style: "ok",
            }], { cancelable:true })        
        }else{
            Alert.alert("Error", "Error Function", [], { cancelable:true })
        }
    }

    useEffect(() => {
        if(loan.length&&itemId) {
            const findLoan = loan.find((el) => {
                return el.id === itemId
            })
            if(findLoan) {
                setSelectedLoan(findLoan)
                setLoading(false)
            }else {
                navigation.navigate("Splash")
            }
        }else{
            navigation.navigate("Splash")
        }
    }, [itemId, loan])

    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <Text style={{fontSize: 20}}>Form Pinjaman</Text>
                <Text style={{fontSize: 15}}>Uang Dompet: {amountDompet}</Text>
                <Text style={{fontSize: 15}}>Uang Dompet Cash: {amountRealDompet}</Text>
                <Text style={{fontSize: 15}}>Uang Tabungan: {amountTabungan}</Text>
                {
                    !loading&&selectedLoan&&
                    <CompFormPayLoan data={{amountDompet, amountRealDompet, amountTabungan, ...selectedLoan}} onSubmit={handleSubmit} navigation={navigation}/>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
