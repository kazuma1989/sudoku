import React, { useState } from 'react'
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native'

function App() {
  const [count, setCount] = useState(0)

  return (
    <View style={styles.box}>
      <Text style={styles.text}>Hello, world!</Text>
      <Button title={`${count}`} onPress={() => setCount(i => i + 1)} />
    </View>
  )
}

const styles = StyleSheet.create({
  box: { padding: 10 },
  text: { fontWeight: 'bold' },
})

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
})
