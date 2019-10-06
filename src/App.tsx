import React, { useReducer, useEffect } from 'react'
import { Dimensions } from 'react-native'
import produce from 'immer'
import styled, { css } from 'styled-components/native'
import * as api from './api'

export default function App() {
  const [{ board, selected }, dispatch] = useReducer(reducer, {
    board: [
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
        {board.map((area, i) => (
          <Area key={i}>
            {area.map((cell, j) => (
              <Cell
                key={`${i}-${j}`}
                selected={`${i}${j}` === selected.join('')}
                onPress={() =>
                  dispatch({
                    type: 'TapCell',
                    payload: [i, j],
                  })
                }
              >
                <CellText type={cell && cell.type}>
                  {cell && cell.value}
                </CellText>
              </Cell>
            ))}
          </Area>
        ))}
      </Board>

      <ButtonArea>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '\u2573'].map(label => (
          <NumberButton
            key={label}
            onPress={() =>
              dispatch({
                type: 'InputNumber',
                payload: label,
              })
            }
          >
            <ButtonLabel>{label}</ButtonLabel>
          </NumberButton>
        ))}
      </ButtonArea>
    </Container>
  )
}

const { width: windowWidth } = Dimensions.get('window')

const [cellFontSize, inputFontSize] = [40, 50].map(size => {
  const standardWindowWidth = 375
  return size * (windowWidth / standardWindowWidth)
})

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
  ${borderStyle};
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 2px;
  border-left-width: 2px;

  flex-direction: row;
  flex-wrap: wrap;
  width: ${windowWidth - 2}px;
  height: ${windowWidth - 2}px;
`

const Area = styled.View`
  ${borderStyle};

  width: 33.3333%;
  height: 33.3333%;
  flex-direction: row;
  flex-wrap: wrap;
`

const Cell = styled.TouchableHighlight.attrs({
  underlayColor: 'rgba(0,0,0,0.5)',
})<{ selected?: boolean }>`
  ${borderStyle};

  background-color: ${p => (p.selected ? 'powderblue' : 'initial')};
  width: 33.3333%;
  height: 33.3333%;
  justify-content: center;
  align-items: center;
`

const CellText = styled.Text<{ type: null | 'INITIAL_HINT' | 'USER_INPUT' }>`
  font-size: ${cellFontSize}px;
  font-weight: ${p => (p.type === 'INITIAL_HINT' ? 'bold' : 'lighter')};
`

const ButtonArea = styled.View`
  margin-top: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const NumberButton = styled.TouchableOpacity`
  margin-right: 7px;
  margin-bottom: 7px;

  border-width: 1px;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`

const ButtonLabel = styled.Text`
  font-size: ${inputFontSize}px;
  font-weight: lighter;
`

type State = {
  board: (
    | null
    | {
        type: 'INITIAL_HINT'
        value: number
      }
    | {
        type: 'USER_INPUT'
        value: number | null
      })[][]
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
        const cell = draft.board[i][j]

        // Board is not ready
        if (!cell) return

        // Cell is readonly
        if (cell.type === 'INITIAL_HINT') return

        draft.board[i][j] = {
          type: 'USER_INPUT',
          value: parseInt(action.payload) || null,
        }
        return
      }

      case 'SetupBoard': {
        const { board } = action.payload
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
          const value = board[apiI][apiJ]
          draft.board[i][j] = value
            ? {
                type: 'INITIAL_HINT',
                value,
              }
            : {
                type: 'USER_INPUT',
                value: null,
              }
        })

        return
      }

      default: {
        const _: never = action
      }
    }
  },
)
