<TestApp />

<Live  code={ `
class App extends React.Component {
  state = { count: 1 }
  constructor( props ) {
    super( props )
    console.log( this )
  }
  render() {
    return <div>{ this.state.count }</div>
  }
}
render( <App /> )
` }/>