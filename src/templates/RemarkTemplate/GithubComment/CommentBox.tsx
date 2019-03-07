import React, { Component } from 'react'

import AbstractGithubComment from '@/__typings__/AbstractGithubComment'
import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import { formatNormalDate } from '@/utils/time'

class Props extends DefaultComponentProps {
  comment: AbstractGithubComment
  remarkParser: any
}

class State {
  remarked: string
}

export default class CommentBox extends Component<Props, State> {
  state: State = new State()

  ref: any = React.createRef()

  componentDidUpdate(prevProps) {
    if (prevProps.remarkParser == null && this.props.remarkParser) {
      const remarked = this.props.remarkParser(this.props.comment.content)
      this.setState({ remarked })
    }
  }

  render() {
    const { avatorUrl, time, content } = this.props.comment
    const formatedTime = formatNormalDate(new Date(time))
    const { remarked } = this.state
    return (
      <div
        style={{
          display: "flex"
        }}
      >
        <div
          style={{
            display: "flex",
            minWidth: "60px",
            justifyContent: "flex-start",
            alignItems: "flex-start"
          }}
        >
          <img
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "5px"
            }}
            src={avatorUrl}
            alt=""
          />
        </div>
        <div
          style={{
            display: "flex",
            padding: "20px 20px 10px 20px",
            boxSizing: "border-box",
            flex: "auto",
            flexDirection: "column",
            border: "1px solid grey",
            borderRadius: "5px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <span
              style={{
                display: "inline-flex",
                fontWeight: "bold"
              }}
            >
              {name}
            </span>
            <span
              style={{
                // margin: "0 0 0 10px",
                color: "#586069"
              }}
            >
              {formatedTime}
            </span>
          </div>
          <div
            style={
              {
                // margin: "5px 0 0 10px"
              }
            }
            dangerouslySetInnerHTML={{
              __html: remarked != null ? remarked : content
            }}
          />
        </div>
      </div>
    )
  }
}
