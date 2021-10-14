// contoh data => {
//     "id": 1,
//     "title": "Nabung"||"Ambil Cash",
//     "type": "Pengeluaran"||"Pemasukan"
//     "amount": 500000,
//     "balanceAfr": 2800000,
//     "balanceBfr": 3400000,
//     "date": 1633881992000,
// }

const initialState = {
    allData: null
}

function historyActivityDompetCashReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAHISTDOMCASH') {
        return { ...state, allData: payload }
    }
    if (type === 'ADDDATAHISTDOMCASH') {
        return { ...state, allData: [payload].concat(state.allData) }
    }
    if (type === 'RESETHISTDOMCASH') {
        return { ...state, allData: null }
    }

    return state
}

export default historyActivityDompetCashReducer
