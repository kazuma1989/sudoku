import React from 'react'
import styled from 'styled-components/native'
import fontSize from './util/fontSize'

type Props = {
  onTapButton: (label: string) => unknown
}

export default function ButtonArea({ onTapButton }: Props) {
  return (
    <_ButtonArea>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '\u2573'].map(label => (
        <NumberButton key={label} onPress={() => onTapButton(label)}>
          <ButtonLabel>{label}</ButtonLabel>
        </NumberButton>
      ))}
    </_ButtonArea>
  )
}

const inputFontSize = fontSize(50)

const _ButtonArea = styled.View`
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
