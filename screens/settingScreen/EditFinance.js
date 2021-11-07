import React, {useState, useEffect} from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import CompFormChangeAmount from '../../components/Form/CompFormChangeAmount'
import { fetchFinance } from '../../store/finance/function'
import { changeFinanceAmount } from '../../store/app/function'
import { useDispatch, useSelector } from 'react-redux'

export default function EditFinance({navigation}) {
    const dispatch = useDispatch()
    const financeData = useSelector((state) => state.financeReducer)
    const [loading, setLoading] = useState(true)

    const handleSubmit = (val) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                for (const property in val) {
                    if(val[property][0]!==financeData[property]) {
                        const result = {[val[property][1]] : val[property][0]}
                        changeFinanceAmount(dispatch, {...result, amountTabungan:financeData.amountTabungan, amountDompet:financeData.amountDompet, amountRealDompet:financeData.amountRealDompet}, (el) => {
                            if(el.message !== "success") {
                                Alert.alert("Error", "error function", [], { cancelable:true })
                                navigation.navigate("Splash")
                            }else{
                                navigation.navigate("Splash")
                            }
                        })
                    }
                }
            },
            style: "ok",
        }], { cancelable:true }) 
    }

    useEffect(() => {
        if(financeData.amountDompet===null&&financeData.amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message === "success") {
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setLoading(false)
        }
    }, [])

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 50 }}> ..... </Text>
                </View>:
                <CompFormChangeAmount data={{amountDompet: financeData.amountDompet, amountRealDompet: financeData.amountRealDompet, amountTabungan: financeData.amountTabungan}} onSubmit={handleSubmit} navigation={navigation}/>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
