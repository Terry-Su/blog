import Prism from 'prismjs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

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

        isAutoTranslated,
        categoryTitle,
        postTimeTitle,
        articleTexts = {},
        markedEndingWordsExtra = ""
      } = getDefaultData()
      const { availableDisqusComment } = this.props
      const { reprintingNote, endingWords, endingWordsExtra } = articleTexts
      return (
        <LayoutHome isMiniHeader={true}>
          <StyledRoot>
            <div className="wrapper">
              <div className="contentWrapper">
                <span className="titleWrapper">{title}</span>

                {/* Note */}
                {isAutoTranslated && (
                  <div className="isAutoTranslatedWrapper">
                    <NoteIsAutoTranslated />
                  </div>
                )}

                <div className="markdownWrapper">
                  <Markdown />
                </div>

                <StyledEndingWordsWrapper className="markdown-body">
                  <p>
                    <strong>{endingWords}</strong>
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: markedEndingWordsExtra
                    }}
                  />
                </StyledEndingWordsWrapper>
                <StyledEndInfo>
                  <div>
                    {postTimeTitle}: {new Date(postTime).toLocaleDateString()}
                  </div>
                  <div className="categoryWrapper">
                    {categoryTitle}: {path}
                  </div>
                  <div className="reprintingNoteWrapper">{reprintingNote}</div>
                </StyledEndInfo>
              </div>
            </div>
            <StyledBottom availableDisqusComment={availableDisqusComment}>
              <div className="wrapper">
                <div>
                  <GithubComment />
                </div>

                <div className="disqusCommentWrapper">
                  <DisqusComment />
                </div>
              </div>
            </StyledBottom>
          </StyledRoot>
        </LayoutHome>
      )
    }
  }
)

const StyledRoot = styled.div`
  > .wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    > .contentWrapper {
      width: 700px;

      > .titleWrapper {
        display: flex;
        font-size: 42px;
        font-weight: bold;
        justify-content: center;
      }

      > .isAutoTranslatedWrapper {
        margin: 40px 0 0 0;
      }

      > .markdownWrapper {
        margin: 40px 0 0 0;
      }
    }
  }
`

const StyledEndingWordsWrapper = styled.div`
  margin-top: 80px;
  padding-top: 80px;
  border-top: 1px solid #ddd;
  > .imageWrapper {
    display: flex;
    justify-content: center;
    > img {
      max-width: 100%;
    }
  }
`

const StyledEndInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 40px 0 0 0;

  > .categoryWrapper {
    margin: 10px 0 0 0;
  }

  > .reprintingNoteWrapper {
    margin: 10px 0 0 0;
  }
`

const StyledBottom: any = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 80px 0 0 0;
  padding: 40px 0;

  > .wrapper {
    width: 700px;

    > .disqusCommentWrapper {
      padding: ${(props: any) =>
        props.availableDisqusComment ? `80px 0 0 0` : "0"};
    }
  }
`
