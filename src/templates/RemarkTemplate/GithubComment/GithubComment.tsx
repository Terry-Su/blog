import fetch from 'isomorphic-fetch'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

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

export default connect(({ article }: any) => ({
  availableDisqusComment: article.availableDisqusComment
}))(
  class GithubComment extends Component<Props, State> {
    state: State = new State()

    private isUnmounting: boolean = false

    componentDidMount() {
      const { githubCommentBase, comment } = getDefaultData()
      const url = `${githubCommentBase}${comment}/comments`
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
              time: created_at
            })
          )
          !this.isUnmounting && this.setState({ comments })
        })
        .then(() => {
          loadScript(
            "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
            () => {
              const remarkParser = window["marked"]
              if (remarkParser) {
                !this.isUnmounting && this.setState({ remarkParser })
              }
            }
          )
        })
    }

    componentWillUnmount() {
      this.isUnmounting = true
    }

    render() {
      const { githubIssuePageBase, comment, articleTexts } = getDefaultData()
      const { availableDisqusComment } = this.props
      const { comments } = this.state
      return (
        <StyledRoot>
          {comment != null && (
            <div
              style={{
                boxSizing: `border-box`,
                textAlign: "center"
              }}
            >
              <a
                style={{
                  color: `#4169e1`,
                  textDecoration: `none`
                }}
                href={`${githubIssuePageBase}${comment}`}
              >
                {articleTexts.commentOnGithub}
              </a>
            </div>
          )}

          <div
            style={{
              padding:
                comment != null && comments.length > 0 ? "40px 0 0 0" : `0`
            }}
          >
            {comments.map((comment, index) => (
              <div key={index} className="comment-box-wrapper">
                <CommentBox
                  comment={comment}
                  remarkParser={this.state.remarkParser}
                />
              </div>
            ))}
          </div>
        </StyledRoot>
      )
    }
  }
)


const StyledRoot = styled.div`
width: "100%";
.comment-box-wrapper {
  margin-bottom: 50px;
}
`