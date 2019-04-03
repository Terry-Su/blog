class Switch extends React.Component{
  constructor( props ) {
    super( props )
    this.state = { open: true }
  }
  
  // // use object
  onButtonClick1() {
    this.setState( { open: ! this.state.open } )
    this.setState( { open: ! this.state.open } )
  }
  
  // use function
  onButtonClick2() {
    this.setState( prevState => ( { open: ! prevState.open } ) )
    this.setState( prevState => {
      console.log( this.state === prevState )
      return ( { open: ! prevState.open } )
    } )
  }
  
  render() {
      return <div>
        <button onClick={ () => this.onButtonClick1() }>{ this.state.open ? 'Close' : 'Open' }</button>
        <button onClick={ () => this.onButtonClick2() }>{ this.state.open ? 'Close' : 'Open' }</button>
      </div>
  }
}

render( <Switch /> )