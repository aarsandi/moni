import AsyncStorage from '@react-native-async-storage/async-storage'

export async function dailyUpdatePlan(cb) {
    const dataPlan = await AsyncStorage.getItem('DATAPLAN')
    if(dataPlan) {
        const result = JSON.parse(dataPlan)
        let now = new Date()
        if(result.status === "active") {
            if(result.updateCron) {
                const updateCron = new Date(result.updateCron).getDate()
                if(now.getDate()!==updateCron) {
                    if(now>result.tanggalGajian) {
                        result.status = "completed"
                        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
                        cb&&cb("fetch")
                    }else if(result.uangTotal<=0) {
                        result.status = "failed"
                        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
                        cb&&cb("fetch")
                    }else{
                        result.updateCron = Date.parse(new Date())
                        if(result.uangHariIni>result.uangHarian) {
                            const uangLebih = result.uangHariIni - result.uangHarian
                            if(result.uangHarianExtra) {
                                if(result.uangHarianExtra-uangLebih < 0) {
                                    result.uangHarianLebih = uangLebih - result.uangHarianExtra
                                    result.uangHarianExtra = 0
                                }else{
                                    result.uangHarianExtra = result.uangHarianExtra - uangLebih
                                    result.uangHarianLebih = 0
                                }
                            }else{
                                result.uangHarianLebih = result.uangHarianLebih + uangLebih
                                result.uangHarianExtra = 0
                            }
                        }else{
                            const uangExtra = result.uangHarian - result.uangHariIni
                            if(result.uangHarianLebih) {
                                if(result.uangHarianLebih-uangExtra < 0) {
                                    result.uangHarianExtra = uangExtra - result.uangHarianLebih
                                    result.uangHarianLebih = 0
                                }else{
                                    result.uangHarianLebih = result.uangHarianLebih - uangExtra
                                    result.uangHarianExtra = 0
                                }
                            }else{
                                result.uangHarianExtra = result.uangHarianExtra + uangExtra
                                result.uangHarianLebih = 0
                            }
                        }
                        result.uangHariIni = 0
                        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
                        cb&&cb("fetch")
                    }
                }else{
                    cb&&cb("dont fetch")
                }
            }else{
                if(now>result.tanggalGajian) {
                    result.status = "completed"
                    await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
                    cb&&cb("fetch")
                }else if(result.uangTotal<=0) {
                    result.status = "failed"
                    await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
                    cb&&cb("fetch")
                }else{
                    result.updateCron = Date.parse(new Date())
                    if(result.uangHariIni>result.uangHarian) {
                        const uangLebih = result.uangHariIni - result.uangHarian
                        if(result.uangHarianExtra) {
                            if(result.uangHarianExtra-uangLebih < 0) {
                                result.uangHarianLebih = uangLebih - result.uangHarianExtra
                                result.uangHarianExtra = 0
                            }else{
                                result.uangHarianExtra = result.uangHarianExtra - uangLebih
                                result.uangHarianLebih = 0
                            }
                        }else{
                            result.uangHarianLebih = result.uangHarianLebih + uangLebih
                            result.uangHarianExtra = 0
                        }
                    }else{
                        const uangExtra = result.uangHarian - result.uangHariIni
                        if(result.uangHarianLebih) {
                            if(result.uangHarianLebih-uangExtra < 0) {
                                result.uangHarianExtra = uangExtra - result.uangHarianLebih
                                result.uangHarianLebih = 0
                            }else{
                                result.uangHarianLebih = result.uangHarianLebih - uangExtra
                                result.uangHarianExtra = 0
                            }
                        }else{
                            result.uangHarianExtra = result.uangHarianExtra + uangExtra
                            result.uangHarianLebih = 0
                        }
                    }
                    result.uangHariIni = 0
                    await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
                    cb&&cb("fetch")
                }
            }
        }
    }
}
