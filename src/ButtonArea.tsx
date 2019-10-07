import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

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

const { width: windowWidth } = Dimensions.get('window')

const [cellFontSize, inputFontSize] = [40, 50].map(size => {
  const standardWindowWidth = 375
  return size * (windowWidth / standardWindowWidth)
})

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
