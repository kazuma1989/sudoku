import React, { useReducer } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform,
  StatusBar,
  Dimensions,
  TouchableHighlight,
} from 'react-native'
import produce from 'immer'

export default function App() {
  const [{ areas, selected }, dispatch] = useReducer(reducer, {
    areas: [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
    ],
    selected: [null, null],
  })

  return (
    <View style={styles.container}>
      <View style={styles.areaContainer}>
        {areas.map((area, i) => (
          <View key={i} style={styles.area}>
            {area.map((cell, j) => {
              const key = `${i}-${j}`

              return (
                <TouchableHighlight
                  key={key}
                  style={[
                    styles.cell,
                    key === selected.join('-') && {
                      backgroundColor: 'powderblue',
                    },
                  ]}
                  onPress={() =>
                    dispatch({
                      type: 'TapCell',
                      payload: [i, j],
                    })
                  }
                  underlayColor="rgba(0,0,0,0.5)"
                >
                  <Text style={styles.cellText}>{cell}</Text>
                </TouchableHighlight>
              )
            })}
          </View>
        ))}
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '\u2573'].map(label => (
          <TouchableHighlight
            key={label}
            style={{
              ...border,
              borderWidth: 1,
              borderRadius: 50,
              marginRight: 3,

              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() =>
              dispatch({
                type: 'InputNumber',
                payload: label,
              })
            }
            underlayColor="rgba(0,0,0,0.5)"
          >
            <Text style={{ fontSize: inputFontSize }}>{label}</Text>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  )
}

type State = {
  areas: (number | null)[][]
  selected: [number, number] | [null, null]
}

type Action =
  | {
      type: 'TapCell'
      payload: [number, number]
    }
  | {
      type: 'InputNumber'
      payload: string
    }

const reducer: (state: State, action: Action) => State = produce(
  (draft: State, action: Action): void => {
    switch (action.type) {
      case 'TapCell': {
        const [i, j] = action.payload
        const [selectedI, selectedJ] = draft.selected

        // Clear selected
        if (i === selectedI && j === selectedJ) {
          draft.selected = [null, null]
          return
        }

        draft.selected = [i, j]
        return
      }

      case 'InputNumber': {
        // Do nothing when no cell is selected
        if (draft.selected[0] === null) return

        const [i, j] = draft.selected
        draft.areas[i][j] = parseInt(action.payload) || null

        return
      }

      default: {
        const _: never = action
      }
    }
  },
)

const { width, height } = Dimensions.get('window')

const [cellFontSize, inputFontSize] = [40, 50].map(size => {
  const deviceHeight =
    Platform.OS === 'android' ? height - StatusBar.currentHeight! : height

  const standardScreenHeight = 680
  return (size * deviceHeight) / standardScreenHeight
})

const border: ViewStyle = {
  borderColor: 'dimgray',
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
    // fontWeight: 'bold',
    fontSize: cellFontSize,
  },
})
