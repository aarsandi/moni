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
    try {
        const dataHistDom = await AsyncStorage.getItem('DATAHISTDOM')
        if(dataHistDom) {
            const result = JSON.parse(dataHistDom)
            dispatch(setDataHistDom(result))
            cb({message: "success"})
        }else{ 
            await AsyncStorage.setItem('DATAHISTDOM', JSON.stringify([]))
            dispatch(setDataHistDom([]))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}

export async function addHistDom(dispatch, val, cb) {
    try {
        const dataHistDom = await AsyncStorage.getItem('DATAHISTDOM')
        if(dataHistDom) {
            const result = JSON.parse(dataHistDom)
            const newResult = [{id:result.length+1,...val}].concat(result)
            await AsyncStorage.setItem('DATAHISTDOM', JSON.stringify(newResult))
            dispatch(setDataHistDom(newResult))
            cb({message: "success"})
        }else{ 
            const newResult = [{id:1,...val}]
            await AsyncStorage.setItem('DATAHISTDOM', JSON.stringify(newResult))
            dispatch(setDataHistDom(newResult))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}

export async function resetHistDom(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAHISTDOM')
        dispatch(resetDataHistDom())
        cb({message: "success"})
    } catch(err) {
        cb({message: "error system"})
    }
}
