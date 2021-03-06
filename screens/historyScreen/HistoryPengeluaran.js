import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native";
import HistoryListCard from '../../components/Card/HistoryPengCard';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { toRupiah } from '../../helpers/NumberToString';

import { fetchHistPeng } from '../../store/historyPengeluaran/function';

export default function HistoryPengeluaran() {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { nama } = useSelector((state) => state.financeReducer)
    const dataHistPeng = useSelector((state) => state.historyPengeluaranReducer.allData);
    const [ dataHist , setDataHist ] = useState({
        total: 0,
        data: []
    });
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState("All");

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };

    function listingHistory () {
        if(dataHistPeng.length) {
            let timeNow = new Date();
            if(filterDate==="Today") {
                let today = timeNow.setHours(0, 0, 0, 0e2);
                const dataRes = dataHistPeng.filter((el) => el.date >= today)
                const resTot = dataRes.reduce(function (accumulator, item) {
                    return accumulator + (item.amount+item.tax);
                }, 0)
                setDataHist({
                    total: resTot,
                    data: dataRes
                })
            }else if(filterDate==="Week") {
                let week = getMonday(timeNow).setHours(0, 0, 0, 0e2)
                const dataRes = dataHistPeng.filter((el) => el.date >= week)
                const resTot = dataRes.reduce(function (accumulator, item) {
                    return accumulator + (item.amount+item.tax);
                }, 0)
                setDataHist({
                    total: resTot,
                    data: dataRes
                })
            }else if(filterDate==="Month") {
                let month = new Date(timeNow.getFullYear(), timeNow.getMonth(), 1).setHours(0, 0, 0, 0e2)
                const dataRes = dataHistPeng.filter((el) => el.date >= month)
                const resTot = dataRes.reduce(function (accumulator, item) {
                    return accumulator + (item.amount+item.tax);
                }, 0)
                setDataHist({
                    total: resTot,
                    data: dataRes
                })
            }else{
                const resTot = dataHistPeng.reduce(function (accumulator, item) {
                    return accumulator + (item.amount+item.tax);
                }, 0)
                setDataHist({
                    total: resTot,
                    data: dataHistPeng
                })
            }
        }
    }

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            if(dataHistPeng===null){
                fetchHistPeng(dispatch, _ => {
                    listingHistory()
                })
            }else{
                listingHistory()
            }
            setLoading(false)
        }
    }, [isFocused, filterDate])

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
                        <>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ flex: 4, fontSize: 15, fontWeight: '800', alignSelf: 'center' }}>Spending History List</Text>
                                <SelectDropdown defaultValue={filterDate} buttonStyle={{ flex: 2, backgroundColor: "#bee3db" }} renderDropdownIcon={() => <Text><Ionicons name="chevron-down" color="#31572c" size={25} /></Text>}
                                    data={["Today", "Week", "Month", "All"]} onSelect={(selectedItem) => { setFilterDate(selectedItem) }}/>
                            </View>
                            <View style={{ flexDirection: "row", paddingBottom: 5 }}>
                                <Text style={{ flex: 4, fontSize: 15, fontWeight: '800', textAlign: 'left' }}>Total</Text>
                                <Text style={{ flex: 2, fontSize: 15, fontWeight: '800', textAlign: 'right' }}>{toRupiah(dataHist.total)}</Text>
                            </View>
                            <FlatList
                                data= {dataHist.data}
                                renderItem= {({ item: dataHist }) => <HistoryListCard data={dataHist}/>  }
                                keyExtractor={(item) => item.id}
                            >
                            </FlatList>
                        </> :
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
