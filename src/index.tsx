import React, { useState } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native'

function App() {
  const [areas] = useState([
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ])

  return (
    <View style={styles.container}>
      <View style={styles.areaContainer}>
        {areas.map((area, i) => (
          <View key={i} style={styles.area}>
            {area.map((cell, j) => (
              <View key={`${i}-${j}`} style={styles.cell}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View>
        <Text>foo</Text>
      </View>
    </View>
  )
}

const { width, height } = Dimensions.get('window')
const deviceHeight =
  Platform.OS === 'android' ? height - StatusBar.currentHeight! : height
const standardScreenHeight = 680
const fontSize = (26 * deviceHeight) / standardScreenHeight

const border: ViewStyle = {
  borderColor: 'silver',
  borderStyle: 'solid',
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
}

const styles = StyleSheet.create({
  container: {
    padding: 1,
  },

  areaContainer: {
    ...border,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,

    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 2,
    height: width - 2,
  },

  area: {
    ...border,

    width: '33.333%',
    height: '33.333%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    ...border,

    width: '33.333%',
    height: '33.333%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellText: {
    fontWeight: 'bold',
    fontSize,
  },
})

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
})
