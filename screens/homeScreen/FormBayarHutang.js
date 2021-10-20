import React, {useEffect,useState} from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { inputPayLoan } from '../../store/app/function'

import { useIsFocused } from "@react-navigation/native";
import CompFormPayLoan from '../../components/Form/CompFormPayLoan'

export default function FormBayarHutang({ route, navigation }) {
    const dispatch = useDispatch()
    const { itemId } = route.params;
    const isFocused = useIsFocused();
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
        if(loan.length&&itemId&&amountDompet!==null) {
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
    }, [itemId, loan, isFocused])

    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                {
                    !loading&&selectedLoan&&
                    <CompFormPayLoan data={{amountDompet, amountRealDompet, amountTabungan, ...selectedLoan}} onSubmit={handleSubmit} navigation={navigation}/>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
