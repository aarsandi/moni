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
