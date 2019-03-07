import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { AppState } from '@/state/app'
import TSLink from '@cache/TSLink'

class Props extends DefaultComponentProps {
  articles: any
}

class State {}

export default connect(({ articles = {} }: any) => ({ articles  }) ) (class List extends Component<Props, State> {
  render() {
    const { listRemarks } = this.props.articles
    return <div>
      {
        listRemarks && listRemarks.map( (remark, index) => <div key={index}>
        <h2><TSLink to={remark.route}>{ remark.title }</TSLink></h2>
        <div>Post: { remark.postTime && new Date( remark.postTime ).toISOString() }</div>
        <div>{ remark.path }</div>
        <p>{ remark.abstract }</p>
        </div> )
      }
    </div>
  }
})
