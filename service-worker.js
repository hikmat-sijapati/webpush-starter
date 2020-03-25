'use strict';

self.addEventListener('push', function(event) {
  // console.log(event.data.json());
  let notification = JSON.parse(event.data.text());
  console.log(notification);
  let title = notification.title;
  // console.log(notification, title);
  //Remove title from notification payload
  delete notification.title;
  const promiseChain = self.registration.showNotification(title, notification);

  event.waitUntil(promiseChain);
});

// self.addEventListener('notificationclick', function(event) {
//   console.log('On notification click: ', event.notification.tag);
//   // Android doesn’t close the notification when you click on it
//   // See: http://crbug.com/463146
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(clients.matchAll({
//     type: 'window'
//   }).then(function(clientList) {
//     for (var i = 0; i < clientList.length; i++) {
//       var client = clientList[i];
//       if (client.url === '/' && 'focus' in client) {
//         return client.focus();
//       }
//     }
//     if (clients.openWindow) {
//       return clients.openWindow('/');
//     }
//   }));
// });
