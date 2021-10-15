// contoh data => {
//     "id": 1,
//     "title": "Ambil Cash||Nabung||Penghasilan||Change Amount||Pinjaman" or "Pengeluaran Harian"||"Pengeluaran Bulanan"||"Pengeluaran Lainnya",
//     "type": "Pengeluaran"||"Pemasukan"
//     "amount": 500000,
//     "balanceAfr": 2800000,
//     "balanceBfr": 3400000,
//     "date": 1633881992000,
// }

const initialState = {
    allData: []
}

function historyActivityDompetReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAHISTDOM') {
        return { ...state, allData: payload }
    }
    if (type === 'ADDDATAHISTDOM') {
        return { ...state, allData: [payload].concat(state.allData) }
    }
    if (type === 'RESETHISTDOM') {
        return { ...state, allData: [] }
    }

    return state
}

export default historyActivityDompetReducer
