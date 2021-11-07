import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from "@react-navigation/native";

import HistoryTabCard from '../../components/Card/HistoryTabCard'
import { fetchHistTab } from '../../store/historyActivityTabungan/function'

export default function HistoryTabungan() {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { nama } = useSelector((state) => state.financeReducer)
    const dataHistTab = useSelector((state) => state.historyActivityTabunganReducer.allData)
    const [loading, setLoading] = useState(true);
    const [ dataHist , setDataHist ] = useState({
        data: []
    });

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            if(dataHistTab===null){
                fetchHistTab(dispatch, _ => {
                    setDataHist({
                        data: dataHistTab
                    })
                })
            }else{
                setDataHist({
                    data: dataHistTab
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
                            renderItem= {({ item: dataHist }) => <HistoryTabCard data={dataHist}/>  }
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
