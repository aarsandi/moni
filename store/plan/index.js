const initialState = {
    status: null, // "active"||null||"completed"
    type: null, // "Gaji"||"Bulanan"
    uangTotal: null, // jika typenya gaji ? maka dari input gajiny : maka dari (dompet+dompetReal)
    jumlahDitabung: null,
    uangHarian: null, // uang harian fix bisa dirubah
    uangHariIni: null, // uang sisa hari ini direset tiap jam 23.30
    tanggalGajian: null,
    pengeluaranBulanan: null // [{title: "", amount: "", due_date: new Date()}]

    // uangBulanan: null, // ini ambil dari : total pengeluaranBulanan (bisa di rubah jika ditambah pengeluaran perbulanny)
    // uangLainnya: null, // ini ambil dari : uangTotal-((uangHarian*jumlahSisaHari)+uangHariIni+uangBulanan+jumlahDitabung)
}

function planReducer(state = initialState, action) {
    const { type, payload } = action
    if (type === 'SETDATAPLAN') {
        return {
            ...state,
            status: payload.status,
            type: payload.type,
            uangTotal: payload.uangTotal,
            jumlahDitabung: payload.jumlahDitabung,
            uangHarian: payload.uangHarian,
            uangHariIni: payload.uangHariIni,
            tanggalGajian: payload.tanggalGajian,
            pengeluaranBulanan: payload.pengeluaranBulanan
        }
    }

    if(type === 'UPDATEDATAPLAN') {
        return {
            ...state,
            ...payload
        }
    }

    if (type === 'RESETDATAPLAN') {
        return {
            ...state,
            status: null,
            type: null,
            uangTotal: null,
            jumlahDitabung: null,
            uangHarian: null,
            uangHariIni: null,
            tanggalGajian: null,
            pengeluaranBulanan: null
        }
    }

    return state
}

export default planReducer
