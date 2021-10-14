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

// action
export async function fetchPlan(dispatch, cb) {
    const dataPlan = await AsyncStorage.getItem('DATAPLAN')
    const result = JSON.parse(dataPlan)
    if(result) {
        dispatch(setDataPlan(result))
        cb({message: "success"})
    }else{
        dispatch(resetDataPlan())
        cb({message: "error"})
    }
}

export async function setupPlanAction(val, dispatch, cb) {
    try {
        const {type,uangTotal,jumlahDitabung,uangHarian,tanggalGajian,pengeluaranBulanan} = val
        const result = {status:"active",type,uangTotal,jumlahDitabung,uangHarian,uangHariIni:0,uangHarianLebih:0,tanggalGajian,pengeluaranBulanan,updateCron:null}
        
        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
        dispatch(setDataPlan(result))
        cb({message: "success"})
    } catch(err) {
        cb({message: "error"})
    }
}

export async function updatePlan(dispatch, val, cb) {
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
}

export async function resetPlan(dispatch, cb) {
    await AsyncStorage.removeItem('DATAPLAN')
    dispatch(resetDataPlan())
    cb({message: "success"})
}
