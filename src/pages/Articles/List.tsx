import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import ResolvedLink from '@/components/ResolvedLink'
import { AppState } from '@/state/app'
import sortBlogsByPostTime from '@/utils/sortBlogsByPostTime'
import { formatNormalDate } from '@/utils/time'
import { RemarkTemplate } from '@cache/App'

class Props extends DefaultComponentProps {
  articles: any
}

class State {}

class List extends Component<Props, State> {
  onLinkMouseMove = () => {
    RemarkTemplate.preload()
  }

  render() {
    const { listRemarks = [] } = this.props.articles || {}
    return (
      <div
        style={{
          boxSizing: `border-box`,
          height: `100%`
        }}
      >
        {listRemarks &&
          listRemarks.map((remark, index) => (
            <div
              key={index}
              style={{
                padding: `0 0 50px 0`
              }}
            >
              <div
                style={{
                  fontSize: `24px`,
                  fontWeight: `bolder`
                }}
                onMouseMove={this.onLinkMouseMove}
              >
                <ResolvedLink to={remark.route}>{remark.title}</ResolvedLink>
              </div>
              <div
                style={{
                  color: `#999`,
                  fontSize: `13px`,
                  padding: `10px 0 10px 0`
                }}
              >
                <span>
                  {remark.postTime &&
                    formatNormalDate(new Date(remark.postTime))}
                </span>

                {/* <span>{remark.path}</span> */}
              </div>
              <div
                style={{
                  color: `#999`,
                  padding: `0px 0 10px 0`
                }}
              >
                {remark.abstract}
              </div>
            </div>
          ))}
      </div>
    )
  }
}

export default connect(({ articles = {} }: any) => ({ articles }))(List)
