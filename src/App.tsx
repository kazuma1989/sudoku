import React, { useReducer, useEffect } from 'react'
import produce from 'immer'
import styled from 'styled-components/native'
import * as api from './api'
import { Board, validate } from './board'
import { nonNull } from './guard'
import alert from './alert'
import BoardArea from './BoardArea'
import ButtonArea from './ButtonArea'

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
      <BoardArea
        board={board}
        selected={selected}
        onTapCell={(i, j) =>
          dispatch({
            type: 'TapCell',
            payload: [i, j],
          })
        }
      />

      <ButtonArea
        onTapButton={label =>
          dispatch({
            type: 'InputNumber',
            payload: label,
          })
        }
      />
    </Container>
  )
}

const Container = styled.View`
  padding: 1px;
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
