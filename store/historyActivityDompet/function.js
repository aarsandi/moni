import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataHistDom(val) {
    return { type: 'SETDATAHISTDOM', payload: val }
}
export function addDataHistDom(val) {
    return { type: 'ADDDATAHISTDOM', payload: val }
}
export function resetDataHistDom() {
    return { type: 'RESETHISTDOM'}
}

// action
export async function fetchHistDom(dispatch, cb) {
    const dataHistDom = await AsyncStorage.getItem('DATAHISTDOM')
    if(dataHistDom) {
        const result = JSON.parse(dataHistDom)
        dispatch(setDataHistDom(result))
        cb&&cb({message: "success"})
    }else{ 
        await AsyncStorage.setItem('DATAHISTDOM', JSON.stringify([]))
        dispatch(resetDataHistDom())
        cb&&cb({message: "error"})
    }
}

export async function addHistDom(dispatch, val, cb) {
    try{
        const { title, type, amount, balanceAfr, balanceBfr, date=Date.parse(new Date()) } = val
        const dataHistDom = await AsyncStorage.getItem('DATAHISTDOM')
        if(dataHistDom) {
            const result = JSON.parse(dataHistDom)
            const newResult = [{id:result.length+1, title, type, amount, balanceAfr, balanceBfr, date }].concat(result)
            await AsyncStorage.setItem('DATAHISTDOM', JSON.stringify(newResult))
            dispatch(setDataHistDom(newResult))
            cb({message: "success"})
        }else{ 
            const newResult = [{id:1, title, type, amount, balanceAfr, balanceBfr, date}]
            await AsyncStorage.setItem('DATAHISTDOM', JSON.stringify(newResult))
            dispatch(setDataHistDom(newResult))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error"})
    }
}

export async function resetHistDom(dispatch, cb) {
    await AsyncStorage.removeItem('DATAHISTDOM')
    dispatch(resetDataHistDom())
    cb({message: "success"})
}
