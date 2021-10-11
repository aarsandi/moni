const initialState = {
    // data app
    isDarkMode : false
}

function dataReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDARKMODE') {
        return { ...state, isDarkMode: payload }
    }

    return state
}

export default dataReducer
