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

const CronJobTask = async () => {
    // Do your task here.
    dailyUpdateCron()
    // Be sure to call completeTask at the end.
    CronJob.completeTask();
};
CronJob.startCronJob(23,0)

PushNotification.configure({
    onNotification: function (notification) {
        RootNavigation.navigate(notification.data.navigator, { screen: notification.data.screen });
    },
    requestPermissions: Platform.OS === 'ios'
})

AppRegistry.registerHeadlessTask('CRONJOB', () => CronJobTask);
AppRegistry.registerComponent(appName, () => App);
