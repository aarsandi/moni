const initialState = {
    nama: null,

    bankTabungan: null,
    rekTabungan: null,
    atasNamaTabungan: null,

    bankDompet: null,
    rekDompet: null,
    atasNamaDompet: null,

    amountTabungan: null,
    amountDompet: null,
    amountRealDompet: null
}

function financeReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAFINANCE') {
        return {
            ...state,
            nama: payload.nama,
            bankTabungan: payload.bankTabungan,
            rekTabungan: payload.rekTabungan,
            atasNamaTabungan: payload.atasNamaTabungan,
            bankDompet: payload.bankDompet,
            rekDompet: payload.rekDompet,
            atasNamaDompet: payload.atasNamaDompet,
            amountTabungan: payload.amountTabungan,
            amountDompet: payload.amountDompet,
            amountRealDompet: payload.amountRealDompet
        }
    }

    if (type === 'RESETDATAFINANCE') {
        return {
            ...state,
            nama: null,
            bankTabungan: null,
            rekTabungan: null,
            atasNamaTabungan: null,
            bankDompet: null,
            rekDompet: null,
            atasNamaDompet: null,
            amountTabungan: null,
            amountDompet: null,
            amountRealDompet: null
        }
    }
    
    if(type === 'UPDATEDATAFINANCE') {
        return {
            ...state,
            ...payload
        }
    }

    return state
}

export default financeReducer
