import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'

class Props extends DefaultComponentProps {}

class State {}

export default class NoteIsAutoTranslated extends Component<Props, State> {
  render() {
    const { noteIsAutoTranslated } = getDefaultData()
    return (
      <div
        style={{
          padding: "20px",
          border: `1px solid #1bc2fa`,
          borderRadius: `5px`,
          background: `white`
        }}
      >
        {noteIsAutoTranslated}
      </div>
    )
  }
}
