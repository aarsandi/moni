import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataHistTab(val) {
    return { type: 'SETDATAHISTTAB', payload: val }
}
export function addDataHistTab(val) {
    return { type: 'ADDDATAHISTTAB', payload: val }
}
export function resetDataHistTab() {
    return { type: 'RESETHISTTAB'}
}

// action
export async function fetchHistTab(dispatch, cb) {
    try {
        const dataHistTab = await AsyncStorage.getItem('DATAHISTTAB')
        if(dataHistTab) {
            const result = JSON.parse(dataHistTab)
            dispatch(setDataHistTab(result))
            cb({message: "success"})
        }else{ 
            await AsyncStorage.setItem('DATAHISTTAB', JSON.stringify([]))
            dispatch(setDataHistTab([]))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}

export async function addHistTab(dispatch, val, cb) {
    try {
        const dataHistTab = await AsyncStorage.getItem('DATAHISTTAB')
        if(dataHistTab) {
            const result = JSON.parse(dataHistTab)
            const newResult = [{id:result.length+1,...val}].concat(result)
            await AsyncStorage.setItem('DATAHISTTAB', JSON.stringify(newResult))
            dispatch(setDataHistTab(newResult))
            cb({message: "success"})
        }else{ 
            const newResult = [{id:1,...val}]
            await AsyncStorage.setItem('DATAHISTTAB', JSON.stringify(newResult))
            dispatch(setDataHistTab(newResult))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error system"})
    }
}

export async function resetHistTab(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAHISTTAB')
        dispatch(resetDataHistTab())
        cb({message: "success"})
    } catch(err) {
        cb({message: "error system"})
    }
}
