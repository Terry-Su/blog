import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import AbstractCategory from '@/__typings__/AbstractCategory'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { STYLE_CATEGORY_PADDING_WIDTH } from '@/styles/STYLES'

class Props extends DefaultComponentProps {
  category: AbstractCategory
  // # e.g.
  // foo/bar
  currentPath: string
}

class State {
  isExpanding: boolean
}

export const CategoryItemColor: any = styled.div`
  color: #717171;
  ${(props: any) =>
    props.persistent ? "color: #111;" : ":hover { color: #333; }"}
`

const Category = connect(({ articles = {} }: any) => ({ articles }))(
  class extends Component<Props, State> {
    state: State = {
      isExpanding: null
    }

    constructor(props: Props) {
      super(props)
      this.state.isExpanding = props.category.expanded
    }

    get isActivated(): boolean {
      const { currentCategoryPath }: any = (this.props as any).articles || {}
      return this.props.currentPath === currentCategoryPath
    }

    onIconClick = event => {
      event.stopPropagation()
      this.setState(prev => ({
        isExpanding: !prev.isExpanding
      }))
    }

    onItemClick = event => {
      const { currentPath } = this.props
      const { remarks } = this.props.category
      this.props.dispatch({
        type: "articles/UPDATE_LIST_REMARKS",
        listRemarks: remarks
      })
      this.props.dispatch({
        type: "articles/UPDATE_CURRENT_CATEGORY_PATH",
        value: currentPath
      })
    }

    render() {
      const {
        name,
        categories,
        expanded,
        hasRemarks,
        remarks
      } = this.props.category
      const { currentPath } = this.props
      const isLast = categories.length === 0
      const { isExpanding } = this.state

      return (
        <div
          style={{
            minWidth: "100%"
          }}
        >
          <CategoryItemColor
            style={{
              boxSizing: `border-box`,
              display: `inline-block`,
              height: `37px`,
              lineHeight: `37px`,
              padding: `0 40px 0 40px`,
              cursor: `default`
            }}
            persistent={this.isActivated}
            onClick={this.onItemClick}
          >
            {!isLast && (
              <span
                style={{
                  cursor: "default"
                }}
                onClick={this.onIconClick}
              >
                {isExpanding ? "∧" : "∨"}
              </span>
            )}
            <span
              style={{
                margin: `0 0 0 7px`,
                whiteSpace: "nowrap"
              }}
            >
              {name}
            </span>
          </CategoryItemColor>
          {/* # Following */}
          <div
            style={{
              boxSizing: "border-box",
              padding: `0 0 0 ${STYLE_CATEGORY_PADDING_WIDTH}px`,
              display: isExpanding ? "block" : "none"
            }}
          >
            {categories.map((category, index) => (
              <Category
                key={index}
                category={category}
                currentPath={`${currentPath}/${category.name}`}
              />
            ))}
          </div>
        </div>
      )
    }
  }
)

export default Category
