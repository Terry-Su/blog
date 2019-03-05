import React, { Component } from 'react'

import getDefaultData from '@/helpers/getDefaultData'

import GithubComment from './GithubComment/GithubComment'

class Props {

}

class State {

}

export default class RemarkTemplate extends Component<Props, State> {
  render() {
    const {
      title,
      text,
      postTime,
      path,
      remarkReprintingNote,
      remarkEndingWords,
    } = getDefaultData()
    return <div>
      <h1>{ title }</h1>
      <h5>{ postTime }</h5>
      <div dangerouslySetInnerHTML={{ __html: text }}></div>
      <p>{remarkEndingWords}</p>
      <p>{path}</p>
      <p>{remarkReprintingNote}</p>
      <GithubComment />
    </div>
  }
}