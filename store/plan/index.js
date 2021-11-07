const initialState = {
    status: null, // "null||active"||"completed"||"failed"
    type: null, // "Payday"||"Monthly"
    uangTotal: null, // jika typenya gaji ? maka dari input gajiny : maka dari (dompet+dompetReal)
    jumlahDitabung: null,
    uangHarian: null, // uang harian fix bisa dirubah
    uangHariIni: null, // uang sisa hari ini direset tiap jam 23.30
    uangHarianLebih: null, // uang harian yang harus diirit (jika uang harian lebih dari batas nambah ini) -> uangHarianLebih=uangHariIni-uangHarian
    uangHarianExtra: null, // uang harian yang kelebihan (jika uang harian kurang dari batas nambah ini jika tidak ada uangHarianLebih jika ada kurangi uangHarianLebih)
    tanggalGajian: null,
    pengeluaranBulanan: [], // [{title: "", amount: "", due_date: new Date(), isLoang: false||true}]
    updateCron: null // ini tanggal update harian

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
            uangHarianLebih: payload.uangHarianLebih,
            uangHarianExtra: payload.uangHarianExtra,
            tanggalGajian: payload.tanggalGajian,
            pengeluaranBulanan: payload.pengeluaranBulanan,
            updateCron: payload.updateCron
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
            uangHarianLebih: null,
            uangHarianExtra: null,
            tanggalGajian: null,
            pengeluaranBulanan: [],
            updateCron: null
        }
    }

    return state
}

export default planReducer
