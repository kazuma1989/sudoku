import React, { useReducer, useEffect } from 'react'
import {
  Text,
  View,
  ViewStyle,
  Platform,
  StatusBar,
  Dimensions,
  TouchableHighlight,
} from 'react-native'
import produce from 'immer'
import * as api from './api'
import styled, { css } from 'styled-components/native'

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

  useEffect(() => {
    api
      .get('https://sugoku.herokuapp.com/board', {
        difficulty: 'easy',
      })
      .then(resp =>
        dispatch({
          type: 'SetupBoard',
          payload: resp,
        }),
      )
  }, [])

  return (
    <Container>
      <Board>
        {areas.map((area, i) => (
          <Area key={i}>
            {area.map((cell, j) => {
              const key = `${i}-${j}`

              return (
                <Cell
                  key={key}
                  style={
                    key === selected.join('-') && {
                      backgroundColor: 'powderblue',
                    }
                  }
                  onPress={() =>
                    dispatch({
                      type: 'TapCell',
                      payload: [i, j],
                    })
                  }
                  underlayColor="rgba(0,0,0,0.5)"
                >
                  <CellText>{cell}</CellText>
                </Cell>
              )
            })}
          </Area>
        ))}
      </Board>

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
    </Container>
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
  | {
      type: 'SetupBoard'
      payload: api.GetMapping['https://sugoku.herokuapp.com/board'][1]
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

      case 'SetupBoard': {
        const { board: b } = action.payload
        ;[
          [0, 0, 0, 0],
          [0, 1, 0, 1],
          [0, 2, 0, 2],
          [0, 3, 1, 0],
          [0, 4, 1, 1],
          [0, 5, 1, 2],
          [0, 6, 2, 0],
          [0, 7, 2, 1],
          [0, 8, 2, 2],

          [1, 0, 0, 3],
          [1, 1, 0, 4],
          [1, 2, 0, 5],
          [1, 3, 1, 3],
          [1, 4, 1, 4],
          [1, 5, 1, 5],
          [1, 6, 2, 3],
          [1, 7, 2, 4],
          [1, 8, 2, 5],

          [2, 0, 0, 6],
          [2, 1, 0, 7],
          [2, 2, 0, 8],
          [2, 3, 1, 6],
          [2, 4, 1, 7],
          [2, 5, 1, 8],
          [2, 6, 2, 6],
          [2, 7, 2, 7],
          [2, 8, 2, 8],

          [3, 0, 3, 0],
          [3, 1, 3, 1],
          [3, 2, 3, 2],
          [3, 3, 4, 0],
          [3, 4, 4, 1],
          [3, 5, 4, 2],
          [3, 6, 5, 0],
          [3, 7, 5, 1],
          [3, 8, 5, 2],

          [4, 0, 3, 3],
          [4, 1, 3, 4],
          [4, 2, 3, 5],
          [4, 3, 4, 3],
          [4, 4, 4, 4],
          [4, 5, 4, 5],
          [4, 6, 5, 3],
          [4, 7, 5, 4],
          [4, 8, 5, 5],

          [5, 0, 3, 6],
          [5, 1, 3, 7],
          [5, 2, 3, 8],
          [5, 3, 4, 6],
          [5, 4, 4, 7],
          [5, 5, 4, 8],
          [5, 6, 5, 6],
          [5, 7, 5, 7],
          [5, 8, 5, 8],

          [6, 0, 6, 0],
          [6, 1, 6, 1],
          [6, 2, 6, 2],
          [6, 3, 7, 0],
          [6, 4, 7, 1],
          [6, 5, 7, 2],
          [6, 6, 8, 0],
          [6, 7, 8, 1],
          [6, 8, 8, 2],

          [7, 0, 6, 3],
          [7, 1, 6, 4],
          [7, 2, 6, 5],
          [7, 3, 7, 3],
          [7, 4, 7, 4],
          [7, 5, 7, 5],
          [7, 6, 8, 3],
          [7, 7, 8, 4],
          [7, 8, 8, 5],

          [8, 0, 6, 6],
          [8, 1, 6, 7],
          [8, 2, 6, 8],
          [8, 3, 7, 6],
          [8, 4, 7, 7],
          [8, 5, 7, 8],
          [8, 6, 8, 6],
          [8, 7, 8, 7],
          [8, 8, 8, 8],
        ].forEach(([i, j, apiI, apiJ]) => {
          draft.areas[i][j] = b[apiI][apiJ] || null
        })

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

const Container = styled.View`
  padding: 1px;
`

const borderStyle = css`
  border-color: dimgray;
  border-style: solid;
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0;
  border-left-width: 0;
`

const Board = styled.View`
  ${borderStyle}
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 2px;
  border-left-width: 2px;

  flex-direction: row;
  flex-wrap: wrap;
  width: ${width - 2}px;
  height: ${width - 2}px;
`

const Area = styled.View`
  ${borderStyle}

  width: 33.3333%;
  height: 33.3333%;
  flex-direction: row;
  flex-wrap: wrap;
`

const Cell = styled.TouchableHighlight`
  ${borderStyle}

  width: 33.3333%;
  height: 33.3333%;
  justify-content: center;
  align-items: center;
`

const CellText = styled.Text`
  font-size: ${cellFontSize}px;
`
