import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from "@react-navigation/native";

import HistoryLoanCard from '../../components/Card/HistoryLoanCard'
import { fetchHistLoan } from '../../store/historyLoan/function'

export default function HistoryLoan() {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { nama } = useSelector((state) => state.financeReducer)
    const dataHistLoan = useSelector((state) => state.historyLoanReducer.allData)
    const [loading, setLoading] = useState(true);
    const [ dataHist , setDataHist ] = useState({
        data: []
    });

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            if(dataHistLoan===null){
                fetchHistLoan(dispatch, _ => {
                    setDataHist({
                        data: dataHistLoan
                    })
                })
            }else{
                setDataHist({
                    data: dataHistLoan
                })
            }
            setLoading(false)
        }
    }, [isFocused])

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 50 }}> ..... </Text>
                </View>:
                <View style={styles.container}>
                    {
                        dataHist.data.length?
                        <FlatList
                            data= {dataHist.data}
                            renderItem= {({ item: dataHist }) => <HistoryLoanCard data={dataHist}/>  }
                            keyExtractor={(item) => item.id}
                        >
                        </FlatList>:
                        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '800' }}>no data</Text>
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#bee3db", margin: 10, borderRadius: 5, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10
    }
})
