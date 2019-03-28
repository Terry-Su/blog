import Prism from 'prismjs'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import LangSwitch from '@/components/LangSwitch/LangSwitch'
import Markdown from '@/components/Markdown/Markdown'
import NoteIsAutoTranslated from '@/components/Note/NoteIsAutoTranslated'
import ResolvedLink from '@/components/ResolvedLink'
import Logo from '@/components/svg/Logo'
import getDefaultData from '@/helpers/getDefaultData'
import LayoutBasic from '@/layouts/LayoutBasic'
import LayoutHome from '@/layouts/LayoutHome'

import DisqusComment from './DisqusComment'
import GithubComment from './GithubComment/GithubComment'

// support jsx
require("prismjs/components/prism-jsx.min")

class Props {
  availableDisqusComment: boolean
}

class State {}

export default connect(({ article }: any) => ({
  availableDisqusComment: article.availableDisqusComment
}))(
  class RemarkTemplate extends Component<Props, State> {
    componentDidMount() {
      window.scrollTo(0, 0)

      Prism.highlightAll()
    }
    render() {
      const {
        title,
        text,
        postTime,
        path,
        reprintingNote,
        endingWords,
        isAutoTranslated,
        categoryTitle,
        postTimeTitle
      } = getDefaultData()
      const { availableDisqusComment } = this.props
      return (
        <LayoutHome isMiniHeader={true}>
          <div
            style={{
              width: `100%`
            }}
          >
            <div
              style={{
                boxSizing: `border-box`,
                display: `flex`,
                justifyContent: `center`,
                width: `100%`,
                padding: `0px 0 0 0`
              }}
            >
              <div
                style={{
                  width: `700px`
                }}
              >
                <span
                  style={{
                    display: `flex`,
                    fontSize: `42px`,
                    fontWeight: `bold`,
                    justifyContent: `center`
                  }}
                >
                  {title}
                </span>

                {/* Note */}
                {isAutoTranslated && (
                  <div
                    style={{
                      margin: `40px 0 0 0`
                    }}
                  >
                    <NoteIsAutoTranslated />
                  </div>
                )}

                <div
                  style={{
                    margin: `40px 0 0 0`
                  }}
                >
                  <Markdown />
                </div>
                <p>{endingWords}</p>
                <div
                  style={{
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `flex-end`,
                    margin: `40px 0 0 0`
                  }}
                >
                  <div>
                    {postTimeTitle}: {new Date(postTime).toLocaleDateString()}
                  </div>
                  <div
                    style={{
                      margin: `10px 0 0 0`
                    }}
                  >
                    {categoryTitle}: {path}
                  </div>
                  <div
                    style={{
                      margin: `10px 0 0 0`
                    }}
                  >
                    {reprintingNote}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                boxSizing: `border-box`,
                display: `flex`,
                justifyContent: `center`,
                width: `100%`,
                margin: `80px 0 0 0`,
                padding: `40px 0`
                // background: `#fafafa`
                // background: `hsl(27, 99%, 95%)`
              }}
            >
              <div
                style={{
                  width: `700px`
                }}
              >
                <div>
                  <GithubComment />
                </div>

                <div
                  style={{
                    padding: availableDisqusComment ? `80px 0 0 0` : "0"
                  }}
                >
                  <DisqusComment />
                </div>
              </div>
            </div>
          </div>
        </LayoutHome>
      )
    }
  }
)
