import React from 'react'
import { Dimensions } from 'react-native'
import styled, { css } from 'styled-components/native'
import { Board } from './board'

type Props = {
  board: Board
  selected: [number, number] | [null, null]
  onTapCell: (i: number, j: number) => unknown
}

export default function BoardArea({ board, selected, onTapCell }: Props) {
  return (
    <_BoardArea>
      {board.map((area, i) => (
        <Area key={i}>
          {area.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              selected={`${i}${j}` === selected.join('')}
              onPress={() => onTapCell(i, j)}
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
    </_BoardArea>
  )
}

const { width: windowWidth } = Dimensions.get('window')

const [cellFontSize, inputFontSize] = [40, 50].map(size => {
  const standardWindowWidth = 375
  return size * (windowWidth / standardWindowWidth)
})

const borderStyle = css`
  border-color: dimgray;
  border-style: solid;
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0;
  border-left-width: 0;
`

const _BoardArea = styled.View`
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
