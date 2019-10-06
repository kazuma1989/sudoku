import React, { useReducer, useEffect } from 'react'
import { Dimensions } from 'react-native'
import produce from 'immer'
import styled, { css } from 'styled-components/native'
import * as api from './api'
import { Board, validate } from './board'
import { nonNull } from './guard'
import alert from './alert'

export default function App() {
  const [{ board, selected, completed }, dispatch] = useReducer(reducer, {
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
    completed: false,
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

  useEffect(() => {
    if (!completed) return

    alert('\uD83C\uDF89 Congratulations!')
  }, [completed])

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
                <CellText
                  type={cell && cell.type}
                  wrong={cell ? 'wrong' in cell && cell.wrong : false}
                >
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

const CellText = styled.Text<{
  type: null | 'INITIAL_HINT' | 'USER_INPUT'
  wrong?: boolean
}>`
  font-size: ${cellFontSize}px;
  font-weight: ${p => {
    if (p.type === 'INITIAL_HINT') {
      return 'bold'
    }
    if (p.wrong) {
      return 'normal'
    }
    return 'lighter'
  }};
  color: ${p => (p.wrong ? 'red' : 'initial')};
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
  board: Board
  selected: [number, number] | [null, null]
  completed: boolean
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
        // Game over
        if (draft.completed) return

        // Do nothing when no cell is selected
        if (draft.selected[0] === null) return

        const [i, j] = draft.selected
        const cell = draft.board[i][j]

        // Board is not ready
        if (!cell) return
        // Cell is not writeable
        if (cell.type !== 'USER_INPUT') return

        cell.value = parseInt(action.payload) || null
        draft.board = validate(draft.board)

        const filled =
          draft.board
            .flatMap(area => area.map(cell => cell && cell.value))
            .filter(nonNull).length ===
          9 * 9
        if (filled) {
          const someWrong = draft.board
            .flatMap(area => area)
            .some(cell => cell && cell.type === 'USER_INPUT' && cell.wrong)
          if (!someWrong) {
            draft.completed = true
          }
        }

        return
      }

      case 'SetupBoard': {
        const { board } = action.payload
        board.forEach((row, apiI) => {
          const areaRow = ~~(apiI / 3) as 0 | 1 | 2
          const cellRow = (apiI % 3) as 0 | 1 | 2

          row.forEach((col, apiJ) => {
            const areaCol = ~~(apiJ / 3) as 0 | 1 | 2
            const cellCol = (apiJ % 3) as 0 | 1 | 2

            const i = 3 * areaRow + areaCol
            const j = 3 * cellRow + cellCol

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
        })

        return
      }

      default: {
        const _: never = action
      }
    }
  },
)
