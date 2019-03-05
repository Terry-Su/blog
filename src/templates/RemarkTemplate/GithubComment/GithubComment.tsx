import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import AbstractGithubComment from '@/__typings__/AbstractGithubComment'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import loadScript from '@/utils/loadScript'

import CommentBox from './CommentBox'

class Props extends DefaultComponentProps {
  availableDisqusComment: boolean
}

class State {
  comments: AbstractGithubComment[] = []
  remarkParser: any
}

export default connect( ({ article }: any) => ({ availableDisqusComment: article.availableDisqusComment }) )( class GithubComment extends Component<Props, State> {
  state: State = new State()

  private isUnmounting: boolean = false

  componentDidMount() {
    const { remarkGithubCommentBase, comment } = getDefaultData()
    const url = `${remarkGithubCommentBase}${comment}/comments`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const comments = data.map(
          ({
            user = {},
            created_at = "",
            updated_at = "",
            body = ""
          }: any) => ({
            avatorUrl: user.avatar_url || "",
            name: user.login || "",
            createTime: created_at,
            updateTime: updated_at,
            content: body,
            time: created_at,
          })
        )
        ! this.isUnmounting && this.setState({ comments })
      }).then( () => {
        loadScript( "https://cdn.jsdelivr.net/npm/marked/marked.min.js", () => {
          const remarkParser = window[ 'marked' ] 
          if ( remarkParser ) {
            ! this.isUnmounting && this.setState( { remarkParser } )
          }
        } )
      } )
  }

  componentWillMount() {
    this.isUnmounting = true
  }

  render() {
    const { remarkGithubIssuePageBase, comment } = getDefaultData()
    const { availableDisqusComment } = this.props
    const { comments } = this.state
    return (
      <div
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <div
          style={{
            margin: "10px 0 20px 0",
            textAlign: "center"
          }}
        >
          <a href={`${remarkGithubIssuePageBase}${comment}`}>
            {comments.length === 0
              ? availableDisqusComment
                ? "Be The First to Comment on Github"
                : "Be The First to Comment on Github"
              : availableDisqusComment
              ? "Commenting on Github Available"
              : "Comment on Github"}
          </a>
        </div>
        {comments.map((comment, index) => (
          <div
            style={{
              margin: "0 0 20px 0"
            }}
            key={index}
          >
            <CommentBox comment={comment} remarkParser={this.state.remarkParser} />
          </div>
        ))}
      </div>
    )
  }
}
)