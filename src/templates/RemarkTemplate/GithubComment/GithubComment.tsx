import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'

import AbstractGithubComment from '@/__typings__/AbstractGithubComment'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import loadScript from '@/utils/loadScript'

import CommentBox from './CommentBox'

class Props extends DefaultComponentProps {}

class State {
  comments: AbstractGithubComment[] = []
  remarkParser: any
}

export default class GithubComment extends Component<Props, State> {
  state: State = new State()

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
        this.setState({ comments })
      }).then( () => {
        loadScript( "https://cdn.jsdelivr.net/npm/marked/marked.min.js", () => {
          const remarkParser = window[ 'marked' ] 
          if ( remarkParser ) {
            this.setState( { remarkParser } )
          }
        } )
      } )
  }

  render() {
    const { remarkGithubIssuePageBase, comment } = getDefaultData()
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
            {true
              ? true
                ? "BE_THE_FIRST_TO_COMMENT_ON_GITHUB"
                : "BE_THE_FIRST_TO_COMMENT"
              : true
              ? "YOU_CAN_ALSO_COMMENT_ON_GITHUB"
              : "WRITE_A_COMMENT"}
          </a>
        </div>
        {this.state.comments.map((comment, index) => (
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
