// contoh data => {
    // id: 1,
    // title: "Coba",
    // detail: "Shhsushhss",
    // type: "Cash"||"Tabungan",
    // amount: 75000,
    // tax: 10000,
    // tenor: 3, 1||3||6||9
    // balanceAfr: 2800000,
    // balanceBfr: 3400000,
    // date: 1633881992000,
// }

const initialState = {
    allData: []
}

function historyLoanReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAHISTLOAN') {
        return { ...state, allData: payload }
    }
    if (type === 'ADDDATAHISTLOAN') {
        return { ...state, allData: [payload].concat(state.allData) }
    }
    if (type === 'RESETHISTLOAN') {
        return { ...state, allData: [] }
    }

    return state
}

export default historyLoanReducer