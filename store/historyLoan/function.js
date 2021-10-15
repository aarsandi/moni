import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataHistLoan(val) {
    return { type: 'SETDATAHISTLOAN', payload: val }
}
export function addDataHistLoan(val) {
    return { type: 'ADDDATAHISTLOAN', payload: val }
}
export function resetDataHistLoan() {
    return { type: 'RESETHISTLOAN'}
}

// action
export async function fetchHistLoan(dispatch, cb) {
    const dataHistLoan = await AsyncStorage.getItem('DATAHISTLOAN')
    if(dataHistLoan) {
        const result = JSON.parse(dataHistLoan)
        dispatch(setDataHistLoan(result))
        cb({message: "success"})
    }else{ 
        await AsyncStorage.setItem('DATAHISTLOAN', JSON.stringify([]))
        dispatch(resetDataHistLoan())
        cb({message: "error"})
    }
}

export async function addHistLoan(dispatch, val, cb) {
    try {
        const { title, detail, type, amount, tax, tenor, balanceAfr, balanceBfr, date = Date.parse(new Date()) } = val
        const dataHistLoan = await AsyncStorage.getItem('DATAHISTLOAN')
        if(dataHistLoan) {
            const result = JSON.parse(dataHistLoan)
            const newResult = [{id:result.length+1, title, detail, type, amount, tax, tenor, balanceAfr, balanceBfr, date}].concat(result)
            await AsyncStorage.setItem('DATAHISTLOAN', JSON.stringify(newResult))
            dispatch(setDataHistLoan(newResult))
            cb({message: "success"})
        }else{ 
            const newResult = [{id:1, title, detail, type, amount, tax, tenor, balanceAfr, balanceBfr, date}]
            await AsyncStorage.setItem('DATAHISTLOAN', JSON.stringify(newResult))
            dispatch(setDataHistLoan(newResult))
            cb({message: "success"})
        }
    } catch(err) {
        cb({message: "error"})
    }
}

export async function resetHistLoan(dispatch, cb) {
    await AsyncStorage.removeItem('DATAHISTLOAN')
    dispatch(resetDataHistLoan())
    cb({message: "success"})
}
