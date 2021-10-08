const initialState = {
    allData: null
}

function historyActivityTabunganReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETHISTORYACTIVITYTABUNGAN') {
        return { ...state, allData: payload.allData }
    }

    return state
}

export default historyActivityTabunganReducer
