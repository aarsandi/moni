// contoh data => {
//     "id": 1,
//     "title": "Coba",
//     "detail": "Shhsushhss",
//     "type": "Harian"||"Bulanan"||"Pinjaman"||"Lainnya",
//     "amount": 500000,
//     "tax": 100000,
//     "payWith": "Cash"||"Rekening Dompet"||"Rekening Tabungan",
//     "balanceAfr": 2800000,
//     "balanceBfr": 3400000,
//     "date": 1633881992000,
// }

const initialState = {
    allData: null
}

function historyPengeluaranReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAHISTPENG') {
        return { ...state, allData: payload }
    }
    if (type === 'ADDDATAHISTPENG') {
        return { ...state, allData: [payload].concat(state.allData) }
    }
    if (type === 'RESETHISTPENG') {
        return { ...state, allData: null }
    }

    return state
}

export default historyPengeluaranReducer
