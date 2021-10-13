// contoh data loan => {
//     id: 1,
//     title: "Coba",
//     detail: "Shhsushhss",
//     type: "Cash"||"Tabungan",
//     amount: 75000,
//     tenor: 3, 1||3||6||9
//     amountPay: [{amount:30000,due_date:1633881992000},{amount:30000,due_date:1633881992000},{amount:15000,due_date:1633881992000}]
//     date: 1633881992000,
// }

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
    amountRealDompet: null,
    loan:[]
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
            amountRealDompet: payload.amountRealDompet,
            loan: payload.loan
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
            amountRealDompet: null,
            loan: []
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
