import { Dimensions } from 'react-native'

const standardWindowWidth = 375

export default function fontSize(size: number) {
  const { width: windowWidth } = Dimensions.get('window')

  return size * (windowWidth / standardWindowWidth)
}
