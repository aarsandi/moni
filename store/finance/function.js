import AsyncStorage from '@react-native-async-storage/async-storage'
import { addHistPeng } from '../historyPengeluaran/function'
import { addHistDom } from '../historyActivityDompet/function'
import { addHistTab } from '../historyActivityTabungan/function'

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

// action
export async function fetchFinance(dispatch, cb) {
    try {
        const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
        if(dataFinance) {
            const result = JSON.parse(dataFinance)
            dispatch(setDataFinance(result))
            cb({message: "success"})
        }else{
            dispatch(resetDataFinance())
            cb({message: "error"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}

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
        cb({message: "error system"})
    }
}

export async function updateFinance(dispatch, val, cb) {
    try {
        const { ...data } = val
        const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
        if(dataFinance) {
            const result = JSON.parse(dataFinance)
            await AsyncStorage.setItem('DATAFINANCE', JSON.stringify({...result,...data}))
            dispatch(updateDataFinance(data))
            cb({message: "success"})
        }else{
            dispatch(resetDataFinance())
            cb({message: "error"})
        }
    } catch (err) {
        cb({message: "error system"})
    }
}

export async function resetFinance(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAFINANCE')
        dispatch(resetDataFinance())
        cb({message: "success"})
    } catch (err) {
        cb({message: "error system"})
    }
}
