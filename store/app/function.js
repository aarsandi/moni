import AsyncStorage from '@react-native-async-storage/async-storage'
import { updateFinance, resetDataFinance } from '../finance/function'
import { updatePlan,fetchPlan } from '../plan/function'

import { addHistPeng } from '../historyPengeluaran/function'
import { addHistDom } from '../historyActivityDompet/function'
import { addHistTab } from '../historyActivityTabungan/function'

// action
export async function inputPengeluaran(dispatch, val, cb) {
    try {
        const {amount,date,detail,payWith,balanceAfr,balanceBfr,tax,title,type} = val
        let inputData = {title,detail,type,payWith,amount:Number(amount),balanceAfr:Number(balanceAfr),balanceBfr:Number(balanceBfr),tax:Number(tax),date:Date.parse(date)}
        const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
        if(dataFinance) {
            const result = JSON.parse(dataFinance)
            if(payWith === "Cash") {
                updateFinance(dispatch, {amountRealDompet: result.amountRealDompet-inputData.amount}, (el) => {
                    if(el.message === "success") {
                        addHistPeng(dispatch, inputData, async (el) => {
                            if(el.message === "success") {
                                cb({message: "success"})
                            }else{
                                cb({message: "error system"})
                            }
                        })
                    } else {
                        cb({message: "error system"})
                    }
                })
            } else if(payWith === "Rekening Dompet") {
                updateFinance(dispatch, {amountDompet: result.amountDompet-(inputData.amount+inputData.tax)}, (el) => {
                    if(el.message === "success") {
                        addHistPeng(dispatch, inputData, async (el) => {
                            if(el.message === "success") {
                                addHistDom(dispatch, {
                                    title:`Pengeluaran ${inputData.type}`,
                                    detail:inputData.title,
                                    type:"Pengeluaran",
                                    amount:inputData.amount+inputData.tax,
                                    balanceAfr:inputData.balanceAfr,
                                    balanceBfr:inputData.balanceBfr,
                                    date:inputData.date
                                }, async (el) => {
                                    if(el.message==="success"){
                                        cb({message: "success"})
                                    }else{
                                        cb({message: "error system"})                                
                                    }
                                })
                            }else{
                                cb({message: "error system"})
                            }
                        })
                    } else {
                        cb({message: "error system"})
                    }
                })
            } else if(payWith === "Rekening Tabungan") {
                updateFinance(dispatch, {amountTabungan: result.amountTabungan-(inputData.amount+inputData.tax)}, (el) => {
                    if(el.message === "success") {
                        addHistPeng(dispatch, inputData, async (el) => {
                            if(el.message === "success") {
                                addHistTab(dispatch, {
                                    title:`Pengeluaran ${inputData.type}`,
                                    detail:inputData.title,
                                    type:"Pengeluaran",
                                    amount:inputData.amount+inputData.tax,
                                    balanceAfr:inputData.balanceAfr,
                                    balanceBfr:inputData.balanceBfr,
                                    date:inputData.date
                                }, async (el) => {
                                    if(el.message==="success"){
                                        cb({message: "success"})
                                    }else{
                                        cb({message: "error system"})                                
                                    }
                                })
                            }else{
                                cb({message: "error system"})
                            }
                        })
                    } else {
                        cb({message: "error system"})
                    }
                })
            } else {
                cb({message: "error system"})
            }          
        }else{
            dispatch(resetDataFinance())
            cb({message: "error"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}
