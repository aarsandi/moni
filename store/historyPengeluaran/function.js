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

export async function fetchHistPeng(dispatch, cb) {
    try {
        const dataHistPeng = await AsyncStorage.getItem('DATAHISTPENG')
        if(dataHistPeng) {
            const result = JSON.parse(dataHistPeng)
            dispatch(setDataHistPeng(result))
            cb({message: "success"})
        }else{ 
            await AsyncStorage.setItem('DATAHISTPENG', JSON.stringify([]))
            dispatch(setDataHistPeng([]))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: 500})
    }
}

export async function addHistPeng(dispatch, val, cb) {
    try {
        const dataHistPeng = await AsyncStorage.getItem('DATAHISTPENG')
        if(dataHistPeng) {
            const result = JSON.parse(dataHistPeng)
            const newResult = [{id:result.length+1,...val}].concat(result)
            await AsyncStorage.setItem('DATAHISTPENG', JSON.stringify(newResult))
            dispatch(setDataHistPeng(newResult))
            cb({message: "success"})
        }else{ 
            const newResult = [{id:1,...val}]
            await AsyncStorage.setItem('DATAHISTPENG', JSON.stringify(newResult))
            dispatch(setDataHistPeng(newResult))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: 500})
    }
}

export async function resetHistPeng(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAHISTPENG')
        dispatch(resetDataHistPeng())
        cb({message: "success"})
    } catch(err) {
        cb({message: 500})
    }
}
