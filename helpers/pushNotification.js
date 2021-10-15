import PushNotification from "react-native-push-notification";

export const createChannelNotification = () => {
  PushNotification.createChannel({
    channelId: "app",
    channelName: "app"
  })
}

export const handleNotif = (navigator, screen, title, detail) => {
  PushNotification.localNotification({
    channelId: "app",
    title: title,
    message: detail,
    data: { navigator:navigator, screen:screen },
    largeIcon: "ic_launcher",
    smallIcon: "ic_launcher_round"
  })
}
