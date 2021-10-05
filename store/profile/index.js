const initialState = {
    email: null,
    rekTabungan: null,
    rekDompet: null
}

function profileReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAPROFILE') {
        return { ...state, email: payload.email, rekTabungan: payload.rekTabungan, rekDompet: payload.rekDompet }
    }
    if (type === 'RESETDATAPROFILE') {
        return { ...state, email: null, rekTabungan: null, rekDompet: null }
    }

    return state
}

export default profileReducer
