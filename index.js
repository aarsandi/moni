/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import CronJob from "react-native-cron-job";
import { dailyUpdateCron } from './helpers/cronjob'

const CronJobTask = async () => {
    // Do your task here.
    dailyUpdateCron()

    // Be sure to call completeTask at the end.
    CronJob.completeTask();
};
CronJob.startCronJob(10,0)

PushNotification.configure({
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
    },
    requestPermissions: Platform.OS === 'ios'
})

AppRegistry.registerHeadlessTask('CRONJOB', () => CronJobTask);
AppRegistry.registerComponent(appName, () => App);
