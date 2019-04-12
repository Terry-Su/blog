import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import * as Babel from '@babel/standalone'

class Props {
  code?: string = ''
  scope?: any
}

class State {}

export default class Live extends Component<Props, State> {
  ref: any = React.createRef()

  componentDidMount() {
    // console.log( this.props.code )

    var input = `
try {
  const render = element => ReactDOM.render( element, __$$__rendering_dom_element__$$__ )
  ` + this.props.code + `
  // function Test() {
  //   return <div>Test123</div>
  // }
  
  class Counter extends React.Component {
    state = { count: 0 }

    onButtonClick = () => {
      this.setState( prevState => ( { count: prevState.count + 1 } ) )
    }

    render() {
      return <div>
      <h1>{ this.state.count }</h1>
      <button onClick={ this.onButtonClick }>Add</button>
      </div>
    }
  }

  
} catch( e ) {
  console.log( e )
}
`;

    let output = ''
    try {
      output = Babel.transform(input, { presets: ["es2015", "react"], plugins: [ 'proposal-class-properties' ] }).code;
    } catch ( e ) {
      console.log( e )
    }

    let ReactAlias = React;
    let ReactDOMAlias = ReactDOM;
    let styledAlias = styled;
    let dom = this.ref.current;
    const { scope: __$$__scope__$$__ = {} } = this.props
    {
      (function() {
        var __$$__rendering_dom_element__$$__ = dom
        var React = ReactAlias;
        var ReactDOM = ReactDOMAlias;
        var styled = styledAlias
        let declareScript = 
        ''
        // 'console.log( __$$__scope__$$__ )'

        for ( let key in __$$__scope__$$__ ) {
          const value = __$$__scope__$$__[ key ]
          declareScript = `${declareScript}
var ${key} = __$$__scope__$$__[ '${key}' ]`
        }
        eval(declareScript + '\n' + output);
      })();
    }
  }

  render() {
    const { code, scope } = this.props
    return (
      <div>
        <div ref={ this.ref }/>
      </div>
    );
  }
}
