import {AppRegistry} from 'react-native';
import App from './App';
import BackgroundGeolocation from 'react-native-background-geolocation';
import DisplayNotification from './components/DisplayNotification';
AppRegistry.registerComponent('geolocation', () => App);

////
// Define your Headless task -- simply a javascript async function to receive
// events from BackgroundGeolocation:
//
let HeadlessTask = async event => {
  let params = event.params;

  switch (event.name) {
    case 'terminate':
      // Use await for async tasks
      let location = await getCurrentPosition();

      break;
  }
};

let getCurrentPosition = async () => {
  await BackgroundGeolocation.ready({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    distanceFilter: 20,
    debug: true,
    startOnBoot: false,
    enableHeadless: true,
    stopOnTerminate: false,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    stopOnStillActivity: false,
    startForeground: false,
  });

  // Define the geofence
  const geofence = {
    identifier: 'MyGeofence',
    radius: 500,
    latitude: 31.467176431705678,
    longitude: 74.2519590719575,
    notifyOnEntry: true,
    notifyOnExit: true,
  };

  // Add the geofence
  await BackgroundGeolocation.addGeofence(geofence, () => {
    console.log('Geofence added successfully.');
  });

  // Event listener for geofence entry
  BackgroundGeolocation.onGeofence(event => {
    if (event.action === 'ENTER') {
      console.log('inside the radius', event);
      DisplayNotification(
        'Enter Notification',
        'You have entered the target location.',
      );
    } else if (event.action === 'EXIT') {
      DisplayNotification(
        'Exit Notification',
        'You have left the target location.',
      );
    }
  });

  // Start tracking location
  return BackgroundGeolocation.start();
};

////
// Register your HeadlessTask with BackgroundGeolocation plugin.
//
BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
