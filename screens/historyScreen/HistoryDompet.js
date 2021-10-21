import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import HistoryDomCard from '../../components/Card/HistoryDomCard';
import { fetchHistDom } from '../../store/historyActivityDompet/function'

export default function HistoryDompet() {
    const dispatch = useDispatch()
    const dataHistDom = useSelector((state) => state.historyActivityDompetReducer.allData)
    const [loading, setLoading] = useState(true);
    const [ dataHist , setDataHist ] = useState({
        data: []
    });

    useEffect(() => {
        if(dataHistDom===null) {
            fetchHistDom(dispatch)
        }else{
            setDataHist({
                data: dataHistDom
            })
        }
        setLoading(false)
    }, [])

    return (
        <View>
            {
                loading?
                <Text>.........</Text>:
                <View style={{backgroundColor: "#bee3db", margin: 10, borderRadius: 5, paddingHorizontal: 20, paddingBottom: 20 }}>
                    <FlatList
                        data= {dataHist.data}
                        renderItem= {({ item: dataHist }) => <HistoryDomCard data={dataHist}/>  }
                        keyExtractor={(item) => item.id}
                    >
                    </FlatList>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
