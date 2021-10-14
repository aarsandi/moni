import AsyncStorage from '@react-native-async-storage/async-storage'

import { fetchFinance, updateFinance, resetFinance, addLoan, updateLoan, removeLoan } from '../finance/function'
import { fetchPlan, updatePlan, resetPlan } from '../plan/function'
import { addHistPeng } from '../historyPengeluaran/function'
import { addHistDom } from '../historyActivityDompet/function'
import { addHistDomCash } from '../historyActivityDompetCash/function'
import { addHistTab } from '../historyActivityTabungan/function'
import { addHistLoan } from '../historyLoan/function'

// action

export function setIsDarkMode(val) {
    return { type: 'SETDARKMODE', payload: val }
}

export function changeFinanceAmount(dispatch, val, cb) {
    const { amountTabunganAft, amountDompetAft, amountRealDompetAft, amountTabungan, amountDompet, amountRealDompet } = val
    if(amountRealDompetAft) {
        const amount = amountRealDompetAft>amountRealDompet?amountRealDompetAft-amountRealDompet:amountRealDompet-amountRealDompetAft
        const status = amountRealDompetAft>amountRealDompet?"Pemasukan":"Pengeluaran"

        updateFinance(dispatch, {amountRealDompet: amountRealDompetAft}, (el) => {
            if(el.message==="success") {
                addHistDomCash(dispatch, {
                    title: "Change Amount", type:status, amount:amount,
                    balanceAfr: amountRealDompetAft, balanceBfr:amountRealDompet
                }, (el) => {
                    if(el.message === "success") {
                        cb({message: "success"})
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                cb({message: "error"})
            }
        })
    } else if(amountDompetAft) {
        const amount = amountDompetAft>amountDompet?amountDompetAft-amountDompet:amountDompet-amountDompetAft
        const status = amountDompetAft>amountDompet?"Pemasukan":"Pengeluaran"

        updateFinance(dispatch, {amountDompet: amountDompetAft}, (el) => {
            if(el.message==="success") {
                addHistDom(dispatch, {
                    title: "Change Amount", type:status, amount:amount,
                    balanceAfr: amountDompetAft, balanceBfr:amountDompet
                }, (el) => {
                    if(el.message === "success") {
                        cb({message: "success"})
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                cb({message: "error"})
            }
        })
    } else if(amountTabunganAft) {
        const amount = amountTabunganAft>amountTabungan?amountTabunganAft-amountTabungan:amountTabungan-amountTabunganAft
        const status = amountTabunganAft>amountTabungan?"Pemasukan":"Pengeluaran"

        updateFinance(dispatch, {amountTabungan: amountTabunganAft}, (el) => {
            if(el.message==="success") {
                addHistTab(dispatch, {
                    title: "Change Amount", type:status, amount:amount,
                    balanceAfr: amountTabunganAft, balanceBfr:amountTabungan
                }, (el) => {
                    if(el.message === "success") {
                        cb({message: "success"})
                    }else{
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
}

export async function inputAmbilCash(dispatch, val, cb) {
    const {
        amount, amountDompet, amountDompetAft, amountRealDompet, tax
    } = val
    updateFinance(dispatch, {amountDompet: amountDompetAft,amountRealDompet: amountRealDompet+amount}, (el) => {
        if(el.message==="success") {
            addHistDomCash(dispatch, {
                title: "Ambil Cash", type:"Pemasukan", amount:amount,
                balanceAfr: amountRealDompet+amount, balanceBfr:amountRealDompet
            }, (el) => {
                if(el.message==="success") {
                    addHistDom(dispatch, {
                        title: "Ambil Cash",type:"Pengeluaran",amount:amountDompet-amountDompetAft,
                        balanceAfr: amountDompetAft, balanceBfr:amountDompet
                    }, (el) => {
                        if(el.message==="success") {
                            cb({message: "success"})
                        }else{
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
}

export async function inputPenghasilan(dispatch, val, cb) {
    const {
        type,amount,amountDompet,amountDompetAft,amountRealDompet
    } = val
    
    if(type === "Rekening"){
        updateFinance(dispatch, {amountDompet: amountDompetAft}, (el) => {
            if(el.message === "success") {
                addHistDom(dispatch, {
                    title: "Penghasilan",type:"Pemasukan",amount:amountDompetAft-amountDompet,
                    balanceAfr: amountDompetAft, balanceBfr:amountDompet
                }, (el) => {
                    if(el.message === "success") {
                        cb({message: "success"})
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                cb({message: "error"})
            }
        })
    }else{
        updateFinance(dispatch, {amountRealDompet: amountRealDompet+amount}, (el) => {
            if(el.message === "success") {
                addHistDomCash(dispatch, {
                    title: "Penghasilan",type:"Pemasukan",amount:amount,
                    balanceAfr: amountRealDompet+amount, balanceBfr:amountRealDompet
                }, (el) => {
                    if(el.message === "success") {
                        cb({message: "success"})
                    }else{
                        cb({message: "error"})
                    }
                })
            }else{
                cb({message: "error"})
            }
        })
    }
}

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
                cb({message: "error"})
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
                cb({message: "error"})
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
    const {
        amountRealDompet,amountTabungan,amountDompet,amountTabunganAft,amountDompetAft,
        title,type,amount,taxPengirim,taxPenerima
    } = val
    cb({message: "success"})
    
    if(type === "Rekening"){
        updateFinance(dispatch, {amountDompet: amountDompetAft, amountTabungan: amountTabunganAft}, (el) => {
            if(el.message === "success") {
                addHistDom(dispatch, {
                    title: title,
                    type:"Pengeluaran",
                    amount:amountDompet-amountDompetAft,
                    balanceAfr: amountDompetAft,
                    balanceBfr:amountDompet
                }, (el) => {
                    if(el.message === "success") {
                        addHistTab(dispatch, {
                            title: title,
                            type: "Pemasukan",
                            amount: amountTabunganAft-amountTabungan,
                            balanceAfr: amountTabunganAft,
                            balanceBfr: amountTabungan
                        }, (el) => {
                            if(el.message==="success") {
                                addHistPeng(dispatch, {
                                    title: title,
                                    detail:"-",
                                    type: "Nabung",
                                    amount: amount,
                                    tax: taxPengirim,
                                    payWith: "Rekening Dompet",
                                    balanceAfr: amountDompetAft,
                                    balanceBfr: amountDompet
                                }, (el) => {
                                    if(el.message==="success") {
                                        cb({message: "success"})
                                    }else{
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
    }else if(type === "Cash"){
        updateFinance(dispatch, {amountRealDompet: amountRealDompet-amount, amountTabungan:amountTabunganAft}, (el) => {
            if(el.message === "success") {
                addHistDomCash(dispatch, {
                    title: title,
                    type:"Pengeluaran",
                    amount:amount,
                    balanceAfr: amountRealDompet-amount,
                    balanceBfr:amountRealDompet
                }, (el) => {
                    if(el.message === "success") {
                        addHistTab(dispatch, {
                            title: title,
                            type: "Pemasukan",
                            amount: amountTabunganAft-amountTabungan,
                            balanceAfr: amountTabunganAft,
                            balanceBfr: amountTabungan
                        }, (el) => {
                            if(el.message==="success") {
                                addHistPeng(dispatch, {
                                    title: title,
                                    type: "Nabung",
                                    amount: amount,
                                    tax: taxPengirim,
                                    payWith: "Cash",
                                    balanceAfr: amountRealDompet-amount,
                                    balanceBfr: amountRealDompet
                                }, (el) => {
                                    if(el.message==="success") {
                                        cb({message: "success"})
                                    }else{
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
    }else{
        cb({message: "error"})
    }
}

export async function inputPengeluaran(dispatch, val, cb) {
    const {
        amountRealDompet,amountTabungan,amountDompet,amountTabunganAft,amountDompetAft,
        title,detail,type,payWith,amount,tax
    } = val
    const inputHistPeng = {title,detail,type,payWith,amount,tax}

    if(payWith === "Cash") {
        updateFinance(dispatch, { amountRealDompet: amountRealDompet-amount }, (el) => {
            if(el.message === "success") {
                addHistPeng(dispatch, inputHistPeng, (el) => {
                    if(el.message === "success") {
                        addHistDomCash(dispatch, {
                            title: title,
                            type: "Pengeluaran",
                            amount: amount,
                            balanceAfr: amountRealDompet-amount,
                            balanceBfr: amountRealDompet
                        }, (el) => {
                            if(el.message==="success") {
                                cb({message: "success"})
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
        })
    } else if(payWith === "Rekening Dompet") {
        updateFinance(dispatch, { amountDompet: amountDompetAft }, (el) => {
            if(el.message === "success") {
                addHistPeng(dispatch, inputHistPeng, (el) => {
                    if(el.message === "success") {
                        addHistDom(dispatch, {
                            title: title,
                            type:"Pengeluaran",
                            amount:amount+tax,
                            balanceAfr:amountDompetAft,
                            balanceBfr:amountDompet
                        }, (el) => {
                            if(el.message==="success"){
                                cb({message: "success"})
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
        })
    } else if(payWith === "Rekening Tabungan") {
        updateFinance(dispatch, {amountTabungan: amountTabunganAft}, (el) => {
            if(el.message === "success") {
                addHistPeng(dispatch, inputHistPeng, (el) => {
                    if(el.message === "success") {
                        addHistTab(dispatch, {
                            title: title,
                            type: "Pengeluaran",
                            amount: amount+tax,
                            balanceAfr: amountTabunganAft,
                            balanceBfr: amountTabungan
                        }, async (el) => {
                            if(el.message==="success"){
                                cb({message: "success"})
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
        })
    } else {
        cb({message: "error"})
    }
}
