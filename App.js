import React, {useEffect, useState} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {Button, SafeAreaView} from 'react-native';
import DisplayNotification from './components/DisplayNotification';
import getLatLong from './helper/getLatLong';
const App = () => {
  const [geofenceLocation, setGeofenceLocation] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getLatLong();
      setGeofenceLocation(fetchedData._data);
    };
    fetchData();
  }, []);
  const onStart = () => {
    // Configure geofence settings
    BackgroundGeolocation.ready({
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
      latitude: geofenceLocation?.lat,
      longitude: geofenceLocation?.long,
      notifyOnEntry: true,
      notifyOnExit: true,
    };
    // Add the geofence
    BackgroundGeolocation.addGeofence(geofence, () => {
      console.log('Geofence added successfully.');
    });

    // Event listener for geofence entry
    BackgroundGeolocation.onGeofence(event => {
      console.log('set', event);
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
        console.log('outside the radius', event);
      }
    });

    // Start tracking location
    BackgroundGeolocation.start();
  };

  return (
    <SafeAreaView>
      <Button title="Start" onPress={() => onStart()} />
      <Button
        title="End"
        onPress={() => {
          BackgroundGeolocation.removeGeofence();
          BackgroundGeolocation.stop();
        }}
      />
    </SafeAreaView>
  );
};

export default App;
