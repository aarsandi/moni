import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'

import { fetchFinance, updateFinance, resetFinance, addLoan, updateLoan, removeLoan } from '../finance/function'
import { fetchPlan, updatePlan, resetPlan } from '../plan/function'

import { addHistPeng } from '../historyPengeluaran/function'
import { addHistDom } from '../historyActivityDompet/function'
import { addHistDomCash } from '../historyActivityDompetCash/function'
import { addHistTab } from '../historyActivityTabungan/function'
import { addHistLoan } from '../historyLoan/function'

// action

export async function inputPayLoan(dispatch, val, cb) {
    const {
        title,detail,amount,type,amountRealDompet,amountTabungan,amountDompet,taxPengirim,taxPenerima,amountTabunganAft,amountDompetAft,selectedLoan
    } = val
    if(type === "Cash") {
        addHistPeng(dispatch, {
            title: title,
            detail: detail,
            type: "Pinjaman",
            amount: amount,
            tax: 0,
            payWith: "Cash",
            balanceAfr: amountRealDompet-amount,
            balanceBfr: amountRealDompet
        }, (el) => {
            if(el.message==="success") {
                addHistDomCash(dispatch, {
                    title: "Pinjaman",
                    type: "Pengeluaran",
                    amount: amount,
                    balanceAfr: amountRealDompet-amount,
                    balanceBfr: amountRealDompet
                }, (el) => {
                    if(el.message==="success") {
                        selectedLoan.amountPay.shift()
                        if(selectedLoan.amountPay.length) {
                            selectedLoan.due_date = selectedLoan.amountPay[0].due_date
                            updateLoan(dispatch, {
                                inputLoan: selectedLoan,
                                amountRealDompet: amountRealDompet-amount
                            }, (el) => {
                                if(el.message === "success") {
                                    cb({message: "success"})
                                }else {
                                    cb({message: "error"})
                                }
                            })
                            cb({message: "success"})
                        }else{
                            removeLoan(dispatch, {
                                loanId: selectedLoan.id,
                                amountRealDompet: amountRealDompet-amount
                            }, (el) => {
                                if(el.message === "success") {
                                    cb({message: "success"})
                                }else{
                                    cb({message: "error"})                            
                                }
                            })
                        }
                    }else {
                        cb({message: "error"})
                    }
                })
            }else{
                Alert.alert("Error", "Error Function", [], { cancelable:true })
            }
        })
    }else if(type === "Tabungan"){
        addHistPeng(dispatch, {
            title: title,
            detail: detail,
            type: "Pinjaman",
            amount: amount,
            tax: taxPengirim,
            payWith: "Rekening Dompet",
            balanceAfr: amountDompetAft,
            balanceBfr: amountDompet
        }, (el) => {
            if(el.message==="success") {
                addHistDom(dispatch, {
                    title: title,
                    type: "Pengeluaran",
                    amount: amountDompet-amountDompetAft,
                    balanceAfr: amountDompetAft,
                    balanceBfr: amountDompet
                }, (el) => {
                    if(el.message==="success") {
                        addHistTab(dispatch, {
                            title: title,
                            type: "Pemasukan",
                            amount: amountTabunganAft-amountTabungan,
                            balanceAfr: amountTabunganAft,
                            balanceBfr: amountTabungan
                        }, (el) => {
                            if(el.message==="success") {
                                selectedLoan.amountPay.shift()
                                if(selectedLoan.amountPay.length) {
                                    selectedLoan.due_date = selectedLoan.amountPay[0].due_date
                                    updateLoan(dispatch, {
                                        inputLoan: selectedLoan,
                                        amountDompet: amountDompetAft,
                                        amountTabungan: amountTabunganAft
                                    }, (el) => {
                                        if(el.message === "success") {
                                            cb({message: "success"})
                                        }else {
                                            cb({message: "error"})
                                        }
                                    })
                                    cb({message: "success"})
                                }else{
                                    removeLoan(dispatch, {
                                        loanId: selectedLoan.id,
                                        amountDompet: amountDompetAft,
                                        amountTabungan: amountTabunganAft
                                    }, (el) => {
                                        if(el.message === "success") {
                                            cb({message: "success"})
                                        }else{
                                            cb({message: "error"})                            
                                        }
                                    })
                                }
                            }else {
                                cb({message: "error"})
                            }
                        })
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                Alert.alert("Error", "Error Function", [], { cancelable:true })
            }
        })
    }else{
        cb({message: "error"})
    }
}

export async function inputPengajuanLoan(dispatch, val, cb) {
    const {
        title,detail,amount,type,tenor,amountPay,amountRealDompet,amountTabungan,amountDompet,taxPengirim,taxPenerima,amountTabunganAft,amountDompetAft
    } = val
    if(type==="Cash") {
        updateFinance(dispatch, {
            amountRealDompet: amountRealDompet+amount
        }, (el) => {
            if(el.message==="success") {
                addLoan(dispatch, {
                    title: title,
                    detail: detail,
                    type: type,
                    amount: amount,
                    tenor: tenor,
                    amountPay: amountPay,
                    due_date: amountPay[0].due_date
                }, (el) => {
                    if(el.message==="success") {
                        addHistLoan(dispatch, {
                            title: title,
                            detail: detail,
                            type: type,
                            amount: amount,
                            tax: 0,
                            tenor: tenor,
                            balanceAfr: amountRealDompet+amount,
                            balanceBfr: amountRealDompet
                        }, (el) => {
                            if(el.message==="success") {
                                addHistDomCash(dispatch, {
                                    title: "Pinjaman",
                                    type: "Pemasukan",
                                    amount: amount,
                                    balanceAfr: amountRealDompet+amount,
                                    balanceBfr: amountRealDompet
                                }, (el) => {
                                    if(el.message==="success") {
                                        cb({message: "success"})
                                    }else {
                                        cb({message: "error"})
                                    }
                                })
                            } else {
                                cb({message: "error"})
                            }
                        })
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                cb({message: "error"})
            }
        })
    } else if(type==="Tabungan") {
        updateFinance(dispatch, { amountDompet: amountDompetAft, amountTabungan: amountTabunganAft }, (el) => {
            if(el.message==="success") {
                addLoan(dispatch, { title: title, detail: detail, type: type, amount: amount, tenor: tenor, amountPay: amountPay, due_date: amountPay[0].due_date }, (el) => {
                    if(el.message==="success") {
                        addHistLoan(dispatch, {
                            title: title,
                            detail: detail,
                            type: type,
                            amount: amount,
                            tax: taxPengirim+taxPenerima,
                            tenor: tenor,
                            balanceAfr: amountDompetAft,
                            balanceBfr: amountDompet
                        }, (el) => {
                            if(el.message==="success") {
                                addHistTab(dispatch, {
                                    title: "Pinjaman",
                                    type: "Pengeluaran",
                                    amount: amountTabungan-amountTabunganAft,
                                    balanceAfr: amountTabunganAft,
                                    balanceBfr: amountTabungan,
                                }, (el) => {
                                    if(el.message==="success") {
                                        addHistDom(dispatch, {
                                            title: "Pinjaman",
                                            type: "Pemasukan",
                                            amount: amountDompetAft-amountDompet,
                                            balanceAfr: amountDompetAft,
                                            balanceBfr: amountDompet
                                        }, (el) => {
                                            if(el.message==="success") {
                                                cb({message: "success"})
                                            }else {
                                                cb({message: "error"})
                                            }
                                        })
                                    } else {
                                        cb({message: "error"})
                                    }
                                })
                            } else {
                                cb({message: "error"})
                            }
                        })
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                cb({message: "error"})
            }
        })
    } else {
        cb({message: "error"})
    }
}

export async function inputNabung(dispatch, val, cb) {
    Alert.alert("Info", "are you sure?", [{
        text: "Ok",
        onPress: () => {
            const {title,type,inputAmount,tax,amountRekeningBfr,amountRekeningAft,amountTabunganBfr,amountTabunganAft,amountDompetCash,date} = val
            // console.log(title,type,inputAmount,tax,amountRekeningBfr,amountRekeningAft,amountTabunganBfr,amountTabunganAft,amountDompetCash,date, "jalan fungsi")
            
            if(type === "Rekening"){
                updateFinance(dispatch, {amountDompet: amountRekeningAft, amountTabungan:amountTabunganAft}, (el) => {
                    if(el.message === "success") {
                        addHistDom(dispatch, {
                            title: "Nabung",
                            type:"Pengeluaran",
                            amount:amountRekeningBfr-amountRekeningAft,
                            balanceAfr: amountRekeningAft,
                            balanceBfr:amountRekeningBfr,
                            date:date
                        }, (el) => {
                            if(el.message === "success") {
                                addHistTab(dispatch, {
                                    title: title,
                                    type: "Pemasukan",
                                    amount: amountTabunganAft-amountTabunganBfr,
                                    balanceAfr: amountTabunganAft,
                                    balanceBfr: amountTabunganBfr
                                }, (el) => {
                                    if(el.message==="success") {
                                        addHistPeng(dispatch, {
                                            title: title,
                                            detail:"-",
                                            type: "Nabung",
                                            amount: amountRekeningBfr-amountRekeningAft,
                                            tax: tax,
                                            payWith: "Rekening Dompet",
                                            balanceAfr: amountRekeningAft,
                                            balanceBfr: amountRekeningBfr
                                        }, (el) => {
                                            if(el.message==="success") {
                                                cb({message: "success"})
                                            }else{
                                                Alert.alert("Error", "Error Function", [], { cancelable:true })
                                            }
                                        })
                                    } else {
                                        Alert.alert("Error", "Error Function", [], { cancelable:true })
                                    }
                                })
                            }else{
                                Alert.alert("Error", "Error Function", [], { cancelable:true })
                            }
                        })
                    }else{
                        Alert.alert("Error", "Error Function", [], { cancelable:true })
                    }
                })
            }else if(type === "Cash"){
                updateFinance(dispatch, {amountRealDompet: amountDompetCash-inputAmount, amountTabungan:amountTabunganAft}, (el) => {
                    if(el.message === "success") {
                        addHistDomCash(dispatch, {
                            title: title,
                            type:"Pengeluaran",
                            amount:inputAmount,
                            balanceAfr: amountDompetCash-inputAmount,
                            balanceBfr:amountDompetCash
                        }, (el) => {
                            if(el.message === "success") {
                                addHistTab(dispatch, {
                                    title: title,
                                    type: "Pemasukan",
                                    amount: amountTabunganAft-amountTabunganBfr,
                                    balanceAfr: amountTabunganAft,
                                    balanceBfr: amountTabunganBfr,
                                    date: date,
                                }, (el) => {
                                    if(el.message==="success") {
                                        addHistPeng(dispatch, {
                                            title: title,
                                            type: "Nabung",
                                            amount: inputAmount,
                                            tax: tax,
                                            payWith: "Cash",
                                            balanceAfr: amountDompetCash-inputAmount,
                                            balanceBfr: amountDompetCash,
                                            date: date,
                                        }, (el) => {
                                            if(el.message==="success") {
                                                cb({message: "success"})
                                            }else{
                                                Alert.alert("Error", "Error Function", [], { cancelable:true })
                                            }
                                        })
                                    } else {
                                        Alert.alert("Error", "Error Function", [], { cancelable:true })
                                    }
                                })
                            }else{
                                Alert.alert("Error", "Error Function", [], { cancelable:true })
                            }
                        })
                    }else{
                        Alert.alert("Error", "Error Function", [], { cancelable:true })
                    }
                })
            }else{
                Alert.alert("Error", "type nabung tidak sesuai", [], { cancelable:true })
            }
        },
        style: "ok",
    }], { cancelable:true })
}

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
            dispatch(resetFinance())
            cb({message: "error"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}
