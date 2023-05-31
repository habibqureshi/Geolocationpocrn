import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
const getLatLong = async () => {
  try {
    const location = await firestore()
      .collection('location')
      .doc('VyX1gFfJ6GmQJrebiFzF')
      .get();
    return location;
  } catch (error) {
    Alert.alert('Error', 'While fetching Lat Long');
  }
};
export default getLatLong;
