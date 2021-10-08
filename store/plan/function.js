import AsyncStorage from '@react-native-async-storage/async-storage'

export function setStatusPlan(val) {
    return { type: 'SETSTATUSPLAN', payload: val }
}
export function setDataPlan(val) {
    return { type: 'SETDATAPLAN', payload: val }
}
export function resetDataPlan() {
    return { type: 'RESETDATAPLAN' }
}

export async function setupPlanAction(val, dispatch, cb) {
    try {
        const {penghasilan,jumlahDitabung,uangHarian,uangBulanan,uangLainnya,tanggalGajian,pengeluaranBulanan} = val
        let result = {status:true,penghasilan:Number(penghasilan),jumlahDitabung:Number(jumlahDitabung),uangHarian:Number(uangHarian),uangBulanan:Number(uangBulanan),uangLainnya:Number(uangLainnya),tanggalGajian:Date.parse(tanggalGajian),pengeluaranBulanan}
        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
        dispatch(setDataPlan(result))
        cb({message: "success"})
    } catch(err) {
        cb({message: 500})
    }
}

export async function fetchPlan(dispatch, cb) {
    try {
        const dataFinance = await AsyncStorage.getItem('DATAPLAN')
        const result = JSON.parse(dataFinance)
        if(result) {
            dispatch(setDataPlan(result))
            cb({message: "success"})
        }else{ 
            cb({message: "error"})
        }
    } catch(err) {
        cb({message: 500})
    }
}

export async function resetPlan(dispatch, cb) {
    try {
        await AsyncStorage.removeItem('DATAPLAN')
        dispatch(resetDataPlan())
        cb({message: "success"})
    } catch (err) {
        cb({message: 500})
    }
}
