import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotification from "react-native-push-notification";

export async function dailyUpdateCron() {
    const dataPlan = await AsyncStorage.getItem('DATAPLAN')
    if(dataPlan) {
        const result = JSON.parse(dataPlan)
        if(result.uangHariIni>result.uangHarian) {
            result.uangHarianLebih = result.uangHariIni-result.uangHarian
        }else{
            const uangLebih = result.uangHarian-result.uangHariIni
            if(result.uangHarianLebih-uangLebih<0) {
                result.uangHarianLebih = 0
            }else{
                result.uangHarianLebih = result.uangHarianLebih-uangLebih
            }
        }
        result.updateCron = Date.parse(new Date())
        result.uangHariIni = 0
        await AsyncStorage.setItem('DATAPLAN', JSON.stringify(result))
    }
}

export async function cobaPushNotif() {
    PushNotification.localNotification({
        channelId: "coba",
        title: "Click sukses",
        message: item,
        bigText: `your cronjob run at - ${new Date().toLocaleString()}`,
        data: { route:"SetupPlan" },
    })
}
