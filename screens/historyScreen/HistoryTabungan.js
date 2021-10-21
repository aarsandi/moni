import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import HistoryTabCard from '../../components/Card/HistoryTabCard'
import { fetchHistTab } from '../../store/historyActivityTabungan/function'

export default function HistoryTabungan() {
    const dispatch = useDispatch()
    const dataHistTab = useSelector((state) => state.historyActivityTabunganReducer.allData)
    const [loading, setLoading] = useState(true);
    const [ dataHist , setDataHist ] = useState({
        data: []
    });

    useEffect(() => {
        if(dataHistTab===null) {
            fetchHistTab(dispatch)
        }else{
            setDataHist({
                data: dataHistTab
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
