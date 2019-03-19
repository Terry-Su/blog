import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import Markdown from '@/components/Markdown/Markdown'
import NoteIsAutoTranslated from '@/components/Note/NoteIsAutoTranslated'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutHome from '@/layouts/LayoutHome'
import { BROWSER_HEIGHT, STYLE_LAYOUT_HOME_HEADER_HEIGHT } from '@/styles/STYLES'

class Props extends DefaultComponentProps {}

class State {}

export default class About extends Component<Props, State> {
  render() {
    const { isAutoTranslated } = getDefaultData()
    return (
      <LayoutHome overflowContent>
        {/* Note */}
        <div
          style={{
            boxSizing: `border-box`,
            display: `flex`,
            justifyContent: `center`,
            width: `100%`,
            minHeight: `calc( ${BROWSER_HEIGHT}px - ${STYLE_LAYOUT_HOME_HEADER_HEIGHT}px )`,
            padding: `40px 0 0 0`
          }}
        >
          <div
            style={{
              width: `700px`
            }}
          >
            {isAutoTranslated && (
              <div style={{ margin: `0 0 40px 0` }}>
                <NoteIsAutoTranslated />
              </div>
            )}
            <Markdown />
          </div>
        </div>
      </LayoutHome>
    )
  }
}
