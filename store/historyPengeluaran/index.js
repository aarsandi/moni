// contoh data => {
//     "id": 1,
//     "title": "Coba",
//     "detail": "Shhsushhss",
//     "type": "Harian"||"Bulanan"||"Pinjaman"||"Nabung"||"Lainnya",
//     "amount": 500000,
//     "tax": 100000,
//     "payWith": "Cash"||"Rekening Dompet"||"Rekening Tabungan",
//     "date": 1633881992000,
// }

const initialState = {
    allData: []
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
        return { ...state, allData: [] }
    }

    return state
}

export default historyPengeluaranReducer
