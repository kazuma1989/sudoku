import produce from 'immer'

export type Board = (
  | null
  | {
      type: 'INITIAL_HINT'
      value: number
    }
  | {
      type: 'USER_INPUT'
      value: number | null
      wrong?: boolean
    })[][]

export const validate: (board: Board) => Board = produce(
  (draft: Board): void => {
    draft.forEach(area => {
      const areaValues = area.map(cell => (cell ? cell.value : null))

      area.forEach((cell, j) => {
        // Skip non-user input
        if (!cell || cell.type !== 'USER_INPUT') return

        // When cleared
        if (!cell.value) {
          cell.wrong = false
          return
        }

        // Validate in an area
        if (areaValues.filter(v => v === cell.value).length >= 2) {
          cell.wrong = true
          return
        }

        cell.wrong = false
      })
    })
  },
)
