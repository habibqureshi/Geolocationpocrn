import React, {useEffect, useState} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {Alert, View, Button, SafeAreaView} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
const App = () => {
  const onStart = () => {
    // Configure geofence settings
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      distanceFilter: 20,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
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
    BackgroundGeolocation.addGeofence(geofence, () => {
      console.log('Geofence added successfully.');
    });

    // Event listener for geofence entry
    BackgroundGeolocation.onGeofence(event => {
      if (event.action === 'ENTER') {
        console.log('inside the radius', event);
        showNotification(
          'Enter Notification',
          'You have entered the target location.',
        );
      } else if (event.action === 'EXIT') {
        showNotification(
          'Exit Notification',
          'You have left the target location.',
        );
        console.log('outside the radius', event);
      }
    });

    // Start tracking location
    BackgroundGeolocation.start();
  };

  const showNotification = async (title, message) => {
    // Display a notification when entering the geofence
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Notifications',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: message,
      android: {
        importance: AndroidImportance.HIGH,
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  };
  useEffect(() => {
    return () => {
      // Clean up geofence and stop tracking on component unmount
      BackgroundGeolocation.removeGeofence();
      BackgroundGeolocation.stop();
    };
  }, []);

  return (
    <SafeAreaView>
      <Button title="Start" onPress={() => onStart()} />
    </SafeAreaView>
  );
};

export default App;
