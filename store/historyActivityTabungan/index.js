// contoh data => {
//     "id": 1,
//     "title": "Coba",
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

function historyActivityTabunganReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAHISTTAB') {
        return { ...state, allData: payload }
    }
    if (type === 'ADDDATAHISTTAB') {
        return { ...state, allData: [payload].concat(state.allData) }
    }
    if (type === 'RESETHISTTAB') {
        return { ...state, allData: null }
    }

    return state
}

export default historyActivityTabunganReducer
