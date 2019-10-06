import { Alert, Platform } from 'react-native'

export default function alert(message: string) {
  if (Platform.OS === 'web') {
    window.alert(message)
  } else {
    Alert.alert(message)
  }
}
