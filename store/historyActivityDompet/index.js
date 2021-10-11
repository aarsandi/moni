// contoh data => {
//     "id": 1,
//     "title": "Nabung",
//     "detail": "Shhsushhss",
//     "type": "Pengeluaran"||"Pemasukan"
//     "amount": 500000,
//     "balanceAfr": 2800000,
//     "balanceBfr": 3400000,
//     "date": 1633881992000,
// }

const initialState = {
    allData: null
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
        return { ...state, allData: null }
    }

    return state
}

export default historyActivityDompetReducer
