import AsyncStorage from '@react-native-async-storage/async-storage'

export function setDataProfile(val) {
    return { type: 'SETDATAPROFILE', payload: val }
}

export function resetDataProfile() {
    return { type: 'RESETDATAPROFILE' }
}

export async function register(val, dispatch, cb) {
    try {
        const dataProfile = { email: val.email, rekTabungan: val.rekTabungan, rekDompet: val.rekDompet }
        dispatch(setDataProfile(dataProfile))
        await AsyncStorage.setItem('DATAPROFILE', JSON.stringify(dataProfile))
        cb({message: "success"})
    } catch(err) {
        cb({message: "error"})
    }
}

export async function fetchProfile(dispatch, cb) {
    try {
        const dataProfile = await AsyncStorage.getItem('DATAPROFILE')
        const stringParse = JSON.parse(dataProfile)
        if(stringParse) {
            dispatch(setDataProfile(stringParse))
        }
        cb(false)
    } catch(err) {
        cb(false)
    }
}

export async function resetData(dispatch, navigation) {
    await AsyncStorage.removeItem('DATAPROFILE')
    dispatch(resetDataProfile())
    navigation.navigate("Register")
}
