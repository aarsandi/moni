import React, { useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from "@react-navigation/native";

import { fetchFinance } from '../../store/finance/function';
import { fetchPlan } from '../../store/plan/function';
import { fetchHistPeng } from '../../store/historyPengeluaran/function';
import { fetchHistDom } from '../../store/historyActivityDompet/function';
import { fetchHistDomCash } from '../../store/historyActivityDompetCash/function';
import { fetchHistTab } from '../../store/historyActivityTabungan/function';
import { fetchHistLoan } from '../../store/historyLoan/function';

export default function Splash({navigation}) {
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const { isDarkMode } = useSelector((state) => state.appReducer)
    const { nama } = useSelector((state) => state.financeReducer)

    useEffect(() => {
        if(nama===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message==="success") {
                    fetchPlan(dispatch, _ => {
                        fetchHistPeng(dispatch, _ => {
                            fetchHistDom(dispatch, _ => {
                                fetchHistDomCash(dispatch, _ => {
                                    fetchHistTab(dispatch, _ => {
                                        fetchHistLoan(dispatch, _ => {
                                            navigation.navigate("AppScreenNavigator")
                                        })
                                    })
                                })
                            })
                        })
                    })
                }else{
                    navigation.navigate("Intro")
                }
            })
        }else{
            fetchPlan(dispatch, _ => {
                fetchHistPeng(dispatch, _ => {
                    fetchHistDom(dispatch, _ => {
                        fetchHistDomCash(dispatch, _ => {
                            fetchHistTab(dispatch, _ => {
                                fetchHistLoan(dispatch, _ => {
                                    navigation.navigate("AppScreenNavigator")
                                })
                            })
                        })
                    })
                })
            })
        }
    }, [isFocused])

    return (
        <View style={{ backgroundColor: isDarkMode, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar
                backgroundColor={isDarkMode}
                barStyle="dark-content"
            />
            <Text style={{ color: '#bee3db', fontSize:50 }}>...</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
