const initialState = {
    allData: null
}

function historyActivityDompetReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETHISTORYACTIVITYDOMPET') {
        return { ...state, allData: payload.allData }
    }

    return state
}

export default historyActivityDompetReducer
