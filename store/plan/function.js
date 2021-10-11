import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataPlan(val) {
    return { type: 'SETDATAPLAN', payload: val }
}
export function updateDataPlan(val) {
    return { type: 'UPDATEDATAPLAN', payload: val }
}
export function resetDataPlan() {
    return { type: 'RESETDATAPLAN' }
}

// {
//     status: null, // "active"||null||"completed"
//     type: null, // "Gaji"||"Bulanan"
//     uangTotal: null, // jika typenya gaji ? maka dari input gajiny : maka dari (dompet+dompetReal)
//     jumlahDitabung: null,
//     uangHarian: null, // uang harian fix bisa dirubah
//     uangHariIni: 0, // uang pengeluaran hari ini direset tiap jam 23.30
//     uangHarianLebih: 0,
//     tanggalGajian: null,
//     pengeluaranBulanan: null // [{title: "", amount: "", due_date: new Date()}]
// }

// action
export async function fetchPlan(dispatch, cb) {
    try {
        const dataPlan = await AsyncStorage.getItem('DATAPLAN')
        const result = JSON.parse(dataPlan)
        if(result) {
            dispatch(setDataPlan(result))
        }
        cb({message: "success"})
    } catch(err) {
        cb({message: "error system"})
    }
}

export async function setupPlanAction(val, dispatch, cb) {
    try {
        const {type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan} = val
        const result = {status:"active",type,uangTotal:Number(uangTotal),jumlahDitabung:Number(jumlahDitabung),uangHarian:Number(uangHarian),uangHariIni:0,uangHarianLebih:0,tanggalGajian:Date.parse(tanggalGajian),pengeluaranBulanan}
        
        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
        dispatch(setDataPlan(result))
        cb({message: "success"})
    } catch(err) {
        cb({message: "error system"})
    }
}

export async function updatePlan(dispatch, val, cb) {
    try {
        const { ...data } = val
        const dataPlan = await AsyncStorage.getItem('DATAPLAN')
        if(dataPlan) {
            const result = JSON.parse(dataPlan)
            await AsyncStorage.setItem('DATAPLAN', JSON.stringify({...result,...data}))
            dispatch(updateDataPlan(data))
            cb({message: "success"})
        }else{
            dispatch(resetDataPlan())
            cb({message: "error"})
        }
    } catch (err) {
        cb({message: "error system"})
    }
}

export async function resetPlan(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAPLAN')
        dispatch(resetDataPlan())
        cb({message: "success"})
    } catch (err) {
        cb({message: "error system"})
    }
}
