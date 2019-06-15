importScripts('https://www.gstatic.com/firebasejs/4.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.4.0/firebase-messaging.js');
var config = {
apiKey: "AIzaSyBHcYZKVU4mja270nlBbPoFKA9d3dTFiYU",
authDomain: "appweb-14c52.firebaseapp.com",
databaseURL: "https://appweb-14c52.firebaseio.com",
projectId: "appweb-14c52",
storageBucket: "appweb-14c52.appspot.com",
messagingSenderId: "294505478058"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
 const title = 'Hello World';
 const options = {
  body: payload.data.body
 };
 return self.registration.showNotification(title, options);
});