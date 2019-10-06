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
    draft.forEach((area, i) => {
      const areaValues = area
        .map(cell => (cell ? cell.value : null))
        .filter(nonNull)

      const areaRow = ~~(i / 3) as 0 | 1 | 2
      const areaCol = (i % 3) as 0 | 1 | 2

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

        const cellRow = ~~(j / 3) as 0 | 1 | 2
        const horizontalValues = [
          draft[3 * areaRow + 0],
          draft[3 * areaRow + 1],
          draft[3 * areaRow + 2],
        ]
          .flatMap(harea => [
            harea[3 * cellRow + 0],
            harea[3 * cellRow + 1],
            harea[3 * cellRow + 2],
          ])
          .map(cell => (cell ? cell.value : null))
          .filter(nonNull)

        // Validate in a row
        if (horizontalValues.filter(v => v === cell.value).length >= 2) {
          cell.wrong = true
          return
        }

        const cellCol = (j % 3) as 0 | 1 | 2
        const verticalValues = [
          draft[3 * 0 + areaCol],
          draft[3 * 1 + areaCol],
          draft[3 * 2 + areaCol],
        ]
          .flatMap(varea => [
            varea[3 * 0 + cellCol],
            varea[3 * 1 + cellCol],
            varea[3 * 2 + cellCol],
          ])
          .map(cell => (cell ? cell.value : null))
          .filter(nonNull)

        // Validate in a column
        if (verticalValues.filter(v => v === cell.value).length >= 2) {
          cell.wrong = true
          return
        }

        cell.wrong = false
      })
    })
  },
)

function nonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
