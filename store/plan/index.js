const initialState = {
    // Data Plan Keuangan
    status: false,
    penghasilan: null,
    jumlahDitabung: null,
    uangHarian: null,
    uangBulanan: null,
    uangLainnya: null,
    tanggalGajian: null,
    pengeluaranBulanan: null // []
}

function planReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETSTATUSPLAN') {
        return {
            ...state,
            status: payload
        }
    }
    if (type === 'SETDATAPLAN') {
        return {
            ...state,
            status: payload.status,
            penghasilan: payload.penghasilan,
            jumlahDitabung: payload.jumlahDitabung,
            uangHarian: payload.uangHarian,
            uangBulanan: payload.uangBulanan,
            uangLainnya: payload.uangLainnya,
            tanggalGajian: payload.tanggalGajian,
            pengeluaranBulanan: payload.pengeluaranBulanan
        }
    }
    if (type === 'RESETDATAPLAN') {
        return {
            ...state,
            status: false,
            penghasilan: null,
            jumlahDitabung: null,
            uangHarian: null,
            uangBulanan: null,
            uangLainnya: null,
            tanggalGajian: null,
            pengeluaranBulanan: null
        }
    }

    return state
}

export default planReducer
