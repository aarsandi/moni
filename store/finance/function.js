import AsyncStorage from '@react-native-async-storage/async-storage'
import {addHistPeng} from '../historyPengeluaran/function'

// type
export function setDataFinance(val) {
    return { type: 'SETDATAFINANCE', payload: val }
}
export function resetDataFinance() {
    return { type: 'RESETDATAFINANCE' }
}
export function updateDataFinance(val) {
    return { type: 'UPDATEDATAFINANCE', payload: val }
}

export function setAmountDompet(val) {
    return { type: 'SETAMOUNTDOMPET', payload: val }
}
export function setAmountRealDompet(val) {
    return { type: 'SETAMOUNTREALDOMPET', payload: val }
}
export function editDataFinance(val) {
    return { type: 'EDITDATAFINANCE', payload: val }
}

// action
export async function setupFinance(val, dispatch, cb) {
    try {
        const result = {
            nama: val.nama,
            amountTabungan: Number(val.amountTabungan),
            amountDompet: Number(val.amountDompet),
            amountRealDompet: Number(val.amountRealDompet),
            bankTabungan: "",
            rekTabungan: "",
            atasNamaTabungan: "",
            bankDompet: "",
            rekDompet: "",
            atasNamaDompet: ""
        }
        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify(result))
        dispatch(setDataFinance(result))
        cb({message: "success"})
    } catch(err) {
        cb({message: "error"})
    }
}

export async function fetchFinance(dispatch, cb) {
    try {
        const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
        if(dataFinance) {
            const result = JSON.parse(dataFinance)
            dispatch(setDataFinance(result))
            cb({message: "success"})
        }else{ 
            cb({message: "error"})
        }
    } catch(err) {
        cb({message: "error"})
    }
}

export async function updateFinance(dispatch, val, cb) {
    try {
        const {amount,date,detail,payWith,tax,title,type} = val
        let inputData = {title,detail,type,payWith,amount:Number(amount),tax:Number(tax),date:Date.parse(date)}
        const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
        if(dataFinance) {
            addHistPeng(dispatch, inputData, async (el) => {
                if(el.message === "success") {
                    const result = JSON.parse(dataFinance)
                    if(payWith === "Cash") {
                        result.amountRealDompet = result.amountRealDompet-inputData.amount
                        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify(result))
                        dispatch(updateDataFinance({amountRealDompet: result.amountRealDompet}))
                    } else if(payWith === "Rekening Dompet") {
                        result.amountDompet = result.amountDompet-inputData.amount
                        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify(result))
                        dispatch(updateDataFinance({amountDompet: result.amountDompet}))
                    } else if(payWith === "Rekening Tabungan") {
                        result.amountTabungan = result.amountTabungan-inputData.amount
                        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify(result))
                        dispatch(updateDataFinance({amountTabungan: result.amountTabungan}))
                    }
                    cb({message: "success"})
                } else {
                    cb({message: 500})
                }
            })
            
        }else{ 
            cb({message: "error"})
        }
    } catch(err) {
        cb({message: 500})
    }
}

export async function resetFinance(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAFINANCE')
        dispatch(resetDataFinance())
        cb({message: "success"})
    } catch (err) {
        cb({message: "error"})
    }
}
