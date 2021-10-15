import PushNotification from "react-native-push-notification";

export const createChannelNotification = () => {
    PushNotification.createChannel({
      channelId: "coba",
      channelName: "coba"
    })
}

export const handleNotif = (route, data) => {
  PushNotification.localNotification({
      channelId: "coba",
      title: "Click sukses",
      message: data,
      bigText: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      data: { route: route },
  })
}
