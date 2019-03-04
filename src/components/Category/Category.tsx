import React, { Component } from 'react'

import AbstractCategory from '@/__typings__/AbstractCategory'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { STYLE_CATEGORY_PADDING_WIDTH } from '@/styles/STYLES'

class Props extends DefaultComponentProps {
  category: AbstractCategory
}

class State {
  isExpanding: boolean
}

export default class Category extends Component<Props, State> {
  state: State = {
    isExpanding: null
  }
  constructor(props: Props) {
    super(props)
    this.state.isExpanding = props.category.expanded
  }

  onIconClick = () => {
    this.setState(prev => ({
      isExpanding: !prev.isExpanding
    }))
  }

  render() {
    const { name, categories, expanded, hasRemarks } = this.props.category
    const isLast = categories.length === 0
    const { isExpanding } = this.state
    return (
      <div
        style={{
          width: "100%"
        }}
      >
        {name}
        {!isLast && (
          <span
            style={{
              cursor: "pointer"
            }}
            onClick={this.onIconClick}
          >
            {isExpanding ? "∧" : "∨"}
          </span>
        )}

        {/* # Following */}
        <div
          style={{
            boxSizing: "border-box",
            padding: `0 0 0 ${STYLE_CATEGORY_PADDING_WIDTH}px`,
            display: isExpanding ? "block" : "none"
          }}
        >
          {categories.map((category, index) => (
            <Category key={index} category={category} />
          ))}
        </div>
      </div>
    )
  }
}
