import React, { Component } from 'react'

class Props {}
const isRunningNodeJS = () => window[ '$ReactDOMServer' ] != null

export default class ComponentSSR extends Component<Props> {
    render() {
        return isRunningNodeJS() ? <div>
        Loading...
      </div> : this.props.children
    }
}

