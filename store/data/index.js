const initialState = {
    isDarkMode : false,
    totalTabungan: null,
    totalDompet: null,
    gajiPerbulan: 0,
    jumlahDitabung: 0,
    uangHarian: 0,
    uangSisa: 0,
    keperluanHarian: null,
    keperluanBulanan: null,

}

function dataReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDARKMODE') {
        return { ...state, isDarkMode: payload }
    }

    return state
}

export default dataReducer
