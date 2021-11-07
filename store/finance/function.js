import AsyncStorage from '@react-native-async-storage/async-storage'

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
    const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
    if(dataFinance) {
        const result = JSON.parse(dataFinance)
        dispatch(setDataFinance(result))
        cb&&cb({message: "success"})
    }else{
        dispatch(resetDataFinance())
        cb&&cb({message: "error"})
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
            atasNamaDompet: "",
            loan: []
        }
        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify(result))
        dispatch(setDataFinance(result))
        cb({message: "success"})
    } catch(err) {
        cb({message: "error"})
    }
}

export async function addLoan(dispatch, val, cb) {
    const { title, detail, type, amount, tenor, amountPay, due_date, date = Date.parse(new Date()) } = val
    const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
    if(dataFinance) {
        const result = JSON.parse(dataFinance)
        const newLoan = [{id:result.loan.length+1, title, detail, type, amount, tenor, amountPay, due_date, date}].concat(result.loan)
        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify({...result,loan:newLoan}))
        dispatch(updateDataFinance({loan:newLoan}))
        cb({message: "success"})
    }else{
        dispatch(resetDataFinance())
        cb({message: "error"})
    }
}

export async function updateLoan(dispatch, val, cb) {
    const { inputLoan, ...data } = val
    const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
    if(dataFinance) {
        const result = JSON.parse(dataFinance)
        let newLoan = result.loan
        const objIndex = newLoan.findIndex((obj => obj.id == inputLoan.id));
        newLoan[objIndex] = inputLoan
        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify({...result, ...data, loan: newLoan}))
        dispatch(updateDataFinance({...data, loan: newLoan}))
        cb({message: "success"})
    }else{
        dispatch(resetDataFinance())
        cb({message: "error"})
    }
}

export async function removeLoan(dispatch, val, cb) {
    const { loanId, ...data } = val
    const dataFinance = await AsyncStorage.getItem('DATAFINANCE')
    if(dataFinance) {
        const result = JSON.parse(dataFinance)
        let newLoan = result.loan.filter(el => el.id !== loanId)
        await AsyncStorage.setItem('DATAFINANCE', JSON.stringify({...result, ...data, loan: newLoan}))
        dispatch(updateDataFinance({...data, loan: newLoan}))
        cb({message: "success"})
    }else{
        dispatch(resetDataFinance())
        cb({message: "error"})
    }
}

export async function updateFinance(dispatch, val, cb) {
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
}

export async function resetFinance(dispatch, cb) {
    await AsyncStorage.removeItem('DATAFINANCE')
    dispatch(resetDataFinance())
    cb&&cb({message: "success"})
}
