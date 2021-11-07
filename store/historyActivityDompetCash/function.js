import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataHistDomCash(val) {
    return { type: 'SETDATAHISTDOMCASH', payload: val }
}
export function addDataHistDomCash(val) {
    return { type: 'ADDDATAHISTDOMCASH', payload: val }
}
export function resetDataHistDomCash() {
    return { type: 'RESETHISTDOMCASH'}
}

// action
export async function fetchHistDomCash(dispatch, cb) {
    const dataHistDomCash = await AsyncStorage.getItem('DATAHISTDOMCASH')
    if(dataHistDomCash) {
        const result = JSON.parse(dataHistDomCash)
        dispatch(setDataHistDomCash(result))
        cb&&cb({message: "success"})
    }else{ 
        await AsyncStorage.setItem('DATAHISTDOMCASH', JSON.stringify([]))
        dispatch(resetDataHistDomCash())
        cb&&cb({message: "error"})
    }
}

export async function addHistDomCash(dispatch, val, cb) {
    const { title, type, amount, balanceAfr, balanceBfr, date=Date.parse(new Date()) } = val
    const dataHistDomCash = await AsyncStorage.getItem('DATAHISTDOMCASH')
    if(dataHistDomCash) {
        const result = JSON.parse(dataHistDomCash)
        const newResult = [{id:result.length+1, title, type, amount, balanceAfr, balanceBfr, date}].concat(result)
        await AsyncStorage.setItem('DATAHISTDOMCASH', JSON.stringify(newResult))
        dispatch(setDataHistDomCash(newResult))
        cb({message: "success"})
    }else{ 
        const newResult = [{id:1, title, type, amount, balanceAfr, balanceBfr, date}]
        await AsyncStorage.setItem('DATAHISTDOMCASH', JSON.stringify(newResult))
        dispatch(setDataHistDomCash(newResult))
        cb({message: "success"})
    }    
}

export async function resetHistDomCash(dispatch, cb) {
    await AsyncStorage.removeItem('DATAHISTDOMCASH')
    dispatch(resetDataHistDomCash())
    cb&&cb({message: "success"})
}
