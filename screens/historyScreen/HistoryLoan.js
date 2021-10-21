import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import HistoryLoanCard from '../../components/Card/HistoryLoanCard'
import { fetchHistLoan } from '../../store/historyLoan/function'

export default function HistoryLoan() {
    const dispatch = useDispatch()
    const dataHistLoan = useSelector((state) => state.historyLoanReducer.allData)
    const [loading, setLoading] = useState(true);
    const [ dataHist , setDataHist ] = useState({
        data: []
    });

    useEffect(() => {
        if(dataHistLoan===null) {
            fetchHistLoan(dispatch)
        }else{
            setDataHist({
                data: dataHistLoan
            })
        }
        setLoading(false)
    }, [])

    return (
        <View>
            {
                loading?
                <Text>.........</Text>:
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
