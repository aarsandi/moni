/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import CronJob from "react-native-cron-job";
import { dailyUpdateCron } from './helpers/cronjob'
import * as RootNavigation from './helpers/rootNavigation';
import { createChannelNotification, handleNotif } from './helpers/pushNotification'

PushNotification.configure({
    onNotification: function (notification) {
        // console.log(notification.data)
        RootNavigation.navigate("PlanScreenNavigator", { screen: 'SetupPlan' });
        // console.log("NOTIFICATION:", notification);
    },
    requestPermissions: Platform.OS === 'ios'
})

const CronJobTask = async () => {
    // Do your task here.
    createChannelNotification()
    // dailyUpdateCron()
    handleNotif("Plan", "coba")

    // Be sure to call completeTask at the end.
    CronJob.completeTask();
};
CronJob.startCronJob(15,30)


AppRegistry.registerHeadlessTask('CRONJOB', () => CronJobTask);
AppRegistry.registerComponent(appName, () => App);
