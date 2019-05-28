'use-strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
/*functions.config().firebase*/
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.firestore.document("Users/{user_id}/Notifications/{notification_id}").onWrite((change, eventContext) => {
    const user_id = eventContext.params.user_id;
    const notification_id = eventContext.params.notification_id;

    console.log("User ID: " + user_id + " | Notification ID: " + notification_id);

    return admin.firestore().collection("Users").doc(user_id).collection("Notifications").doc(notification_id).get().then(queryResult => {
          const from_user_id = queryResult.data().from;
          const from_user_name = queryResult.data().name;
		  const activityName = queryResult.data().activityNameAction;
		  
          const to_user_id = queryResult.data().to;
          const notification_message = queryResult.data().message;

          const from_data = admin.firestore().collection("Users").doc(from_user_id).get();
          const to_data = admin.firestore().collection("Users").doc(user_id).get();

          return Promise.all([from_data, to_data]).then(result => {
              const from_name = result[0];
              const to_name = result[1];

              console.log("FROM: " + from_user_id + " TO: " + to_user_id);

                const payload = {
                    notification: {
                          title: "Notification From " + from_user_name,
                          body: notification_message,
                          icon: "default",
                          sound: "default", 
                          click_action: activityName
                    },
                    data: {
                      userID: user_id,
                      activityType: queryResult.data().activityType,
  					  apiKey: queryResult.data().apiKey,
    				  sessionId: queryResult.data().sessionId,
    				  tokenPublisher: queryResult.data().tokenPublisher,
    				  tokenSubscriber: queryResult.data().tokenSubscriber,
    				  tokenModerator: queryResult.data().tokenModerator
 					}
                };

                return admin.messaging().sendToTopic(to_user_id, payload).then(result =>{
                      console.log("Notification Sent.");
                      return result;
                });
          });
    });
});


exports.sendNotificationForChats = functions.firestore.document("Users/{user_id}/Notifications-Chats/{notification_id}").onWrite((change, eventContext) => {
    const user_id = eventContext.params.user_id;
    const notification_id = eventContext.params.notification_id;

    console.log("User ID: " + user_id + " | Notification ID: " + notification_id);

    return admin.firestore().collection("Users").doc(user_id).collection("Notifications-Chats").doc(notification_id).get().then(queryResult => {
          const from_user_id = queryResult.data().from;
          const from_user_name = queryResult.data().name;
		  const activityName = queryResult.data().activityNameAction;
		  
          const to_user_id = queryResult.data().to;
          const notification_message = queryResult.data().message;

          const from_data = admin.firestore().collection("Users").doc(from_user_id).get();
          const to_data = admin.firestore().collection("Users").doc(user_id).get();

          return Promise.all([from_data, to_data]).then(result => {
              const from_name = result[0];
              const to_name = result[1];

              console.log("FROM: " + from_user_id + " TO: " + to_user_id);

                const payload = {
                    notification: {
                          title: "Notification From " + from_user_name,
                          body: notification_message,
                          icon: "default",
                          sound: "default", 
                          click_action: activityName
                    },
                    data: {
                      userID: user_id,
                      activityType: queryResult.data().activityType
 					}
                };

                return admin.messaging().sendToTopic(to_user_id, payload).then(result =>{
                      console.log("Notification Sent.");
                      return result;
                });
          });
    });
});

