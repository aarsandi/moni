const initialState = {
    // data app
    isDarkMode : false
}

function appReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDARKMODE') {
        return { ...state, isDarkMode: payload }
    }

    return state
}

export default appReducer
