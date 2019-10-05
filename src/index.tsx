import React, { useState } from 'react'
import { AppRegistry, StyleSheet, Text, View, ViewStyle } from 'react-native'

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
    </View>
  )
}

const border: ViewStyle = {
  borderStyle: 'solid',
  borderColor: 'silver',
  borderWidth: 1,
}

const cell = {
  size: 70,
  fontSize: 40,
}

const areaSize = cell.size * 3 + border.borderWidth! * 2
const areaContainerSize = areaSize * 3 + border.borderWidth! * 2 + 2

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  areaContainer: {
    ...border,
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: areaContainerSize,
    height: areaContainerSize,
  },

  area: {
    ...border,
    width: areaSize,
    height: areaSize,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    ...border,
    width: cell.size,
    height: cell.size,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellText: {
    fontWeight: 'bold',
    fontSize: cell.fontSize,
  },
})

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
})
