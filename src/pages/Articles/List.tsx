import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import ResolvedLink from '@/components/ResolvedLink'
import { AppState } from '@/state/app'
import { formatNormalDate } from '@/utils/time'

class Props extends DefaultComponentProps {
  articles: any
}

class State {}

export default connect(({ articles = {} }: any) => ({ articles }))(
  class List extends Component<Props, State> {
    render() {
      const { listRemarks } = this.props.articles
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
                    fontWeight: `bold`
                  }}
                >
                  <ResolvedLink to={remark.route}>{remark.title}</ResolvedLink>
                </div>
                <div
                  style={{
                    color: `#999`,
                    padding: `10px 0 10px 0`
                  }}
                >
                  {remark.abstract}
                </div>
                <div
                  style={{
                    color: `#999`,
                    fontSize: `13px`
                  }}
                >
                  <span>
                    {remark.postTime &&
                      formatNormalDate(new Date(remark.postTime))}
                  </span>

                  {/* <span>{remark.path}</span> */}
                </div>
              </div>
            ))}
        </div>
      )
    }
  }
)
