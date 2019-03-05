import React, { Component } from 'react'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'

class Props extends DefaultComponentProps {

}

class State {

}



export default class Footer extends Component<Props, State> {
  render() {
    const { authorUrl } = getDefaultData()
    return <div style={{
      display: 'grid',
      placeItems: 'center',
      height: '60px',
    }}>
    <span>Copyright © 2017-{ (new Date()).getFullYear() }  <a href={ authorUrl }>Terry Su</a>  ALL RIGHTS RESERVED</span>
    </div>
  }
}