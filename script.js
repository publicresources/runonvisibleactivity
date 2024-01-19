function runOnVisibleActivity(callback) {
    let isActivityVisible = function (activity) {
        console.log(activity.getWindow().getDecorView().getWindowVisibility())
        return !activity.isFinishing() && !activity.isDestroyed() && activity.getWindow() != null && activity.getWindow().getDecorView().getWindowVisibility() == 0;
    }
    Java.perform(function () {
        const jActivityThread = Java.use('android.app.ActivityThread')
        const jActivityThread_ActivityClientRecord = Java.use("android.app.ActivityThread$ActivityClientRecord")
        Java.scheduleOnMainThread(function () {
            let activityThread = jActivityThread.sCurrentActivityThread.value
            let mActivities = activityThread.mActivities.value
            const ArrayMap = Java.use('android.util.ArrayMap');
            const len = ArrayMap.size.call(mActivities);
            let visible_activity = null
            for (let i = 0; i < len; i++) {
                let key = mActivities.keyAt(i)
                let activityClientRecord = Java.cast(mActivities.get(key), jActivityThread_ActivityClientRecord)
                if (isActivityVisible(activityClientRecord.activity.value)) {
                    visible_activity = activityClientRecord.activity.value
                    break;
                }
            }
            callback(visible_activity)
        });
    });
}



function  wait_activity() {
    runOnVisibleActivity(async function (context) {
        if (context == null) {
            setTimeout(wait_activity,1000)
        }else{
            console.log("Current activity: ",context)
        }
    })
}

wait_activity()

