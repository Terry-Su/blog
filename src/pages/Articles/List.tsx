import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { AppState } from '@/state/app'

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
        {/* <h2><Link to={remark.route}>{ remark.title }</Link></h2> */}
        <div>Post: { remark.postTime }</div>
        <div>{ remark.path }</div>
        <p>{ remark.abstract }</p>
        </div> )
      }
    </div>
  }
})
