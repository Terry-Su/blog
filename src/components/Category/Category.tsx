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
      const { name, categories } = this.props.category
      const { currentPath } = this.props
      const isLast = categories.length === 0
      const { isExpanding } = this.state

      return (
        <StyledRoot>
          <StyledCategoryItem
            isLast={isLast}
            persistent={this.isActivated}
            onClick={this.onItemClick}
          >
            {!isLast && (
              <span className="icon" onClick={this.onIconClick}>
                {isExpanding ? "∧" : "∨"}
              </span>
            )}
            <span className="text">{name}</span>
          </StyledCategoryItem>
          <StyledSubCategoriesWrapper isExpanding={isExpanding}>
            {categories.map((category, index) => (
              <Category
                key={index}
                category={category}
                currentPath={`${currentPath}/${category.name}`}
              />
            ))}
          </StyledSubCategoriesWrapper>
        </StyledRoot>
      )
    }
  }
)

export default Category

const StyledRoot = styled.div`
  min-width: 100%;
`

export const StyledCategoryItem: any = styled.div`
  box-sizing: border-box;
  /* display: inline-block; */
  min-width: 100%;
  min-height: 37px;
  padding: 0 40px 0 40px;
  line-height: 37px;
  cursor: default;
  color: #717171;

  ${(props: any) =>
    props.persistent ? "color: #111;" : ":hover { color: #333; }"}

  >.icon {
    width: 12px;
    cursor: default;
  }

  > .text {
    margin: 0 0 0 ${(props: any) => (props.isLast ? 12 + 7 : 7)}px;
    white-space: nowrap;
  }
`

const StyledSubCategoriesWrapper: any = styled.div`
  box-sizing: border-box;
  padding: 0 0 0 ${STYLE_CATEGORY_PADDING_WIDTH}px;
  display: ${(props: any) => (props.isExpanding ? "block" : "none")};
`
