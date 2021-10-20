import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataHistPeng(val) {
    return { type: 'SETDATAHISTPENG', payload: val }
}
export function addDataHistPeng(val) {
    return { type: 'ADDDATAHISTPENG', payload: val }
}
export function resetDataHistPeng() {
    return { type: 'RESETHISTPENG'}
}

// action
export async function fetchHistPeng(dispatch, cb) {
    const dataHistPeng = await AsyncStorage.getItem('DATAHISTPENG')
    if(dataHistPeng) {
        const result = JSON.parse(dataHistPeng)
        dispatch(setDataHistPeng(result))
        cb&&cb({message: "success"})
    }else{ 
        await AsyncStorage.setItem('DATAHISTPENG', JSON.stringify([]))
        dispatch(resetDataHistPeng())
        cb&&cb({message: "error"})
    }
}

export async function addHistPeng(dispatch, val, cb) {
    try {
        const { title, detail, type, amount, tax, payWith, date= Date.parse(new Date()) } = val
        const dataHistPeng = await AsyncStorage.getItem('DATAHISTPENG')
        if(dataHistPeng) {
            const result = JSON.parse(dataHistPeng)
            const newResult = [{id:result.length+1, title, detail, type, amount, tax, payWith, date}].concat(result)
            await AsyncStorage.setItem('DATAHISTPENG', JSON.stringify(newResult))
            dispatch(setDataHistPeng(newResult))
            cb({message: "success"})
        }else{ 
            const newResult = [{id:1, title, detail, type, amount, tax, payWith, date}]
            await AsyncStorage.setItem('DATAHISTPENG', JSON.stringify(newResult))
            dispatch(setDataHistPeng(newResult))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error"})
    }
}

export async function resetHistPeng(dispatch, cb) {
    await AsyncStorage.removeItem('DATAHISTPENG')
    dispatch(resetDataHistPeng())
    cb&&cb({message: "success"})
}
