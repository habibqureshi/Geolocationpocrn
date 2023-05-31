import notifee, {AndroidImportance} from '@notifee/react-native';

const DisplayNotification = async (title, message) => {
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
export default DisplayNotification;
