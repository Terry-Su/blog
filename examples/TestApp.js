class Modal extends React.Component {
  render() {
    const {
      visible,
      onClose
    } = this.props
    return visible && ReactDOM.createPortal(<StyledModalRoot>
      <div className="box">
        Content
        <br/>
        <button onClick={onClose}>Close</button>
      </div>
    </StyledModalRoot>, document.body)
  }
}

class App extends React.Component {
  state = {
    visibleModal: false
  }
  showModal = () => this.setState( { visibleModal: true } )
  handleCloseModal = () => this.setState( { visibleModal: false } )
  render() {
    const { visibleModal } = this.state
    return <div style={{padding: '20px'}}>
    <button onClick={ this.showModal }>Show Modal</button>
    <Modal visible={visibleModal} onClose={ this.handleCloseModal } />
  </div>
  }
}

const StyledModalRoot = styled.div`
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: rgba( 0, 0, 0, 0.2 );

  >.box {
    position: relative;
    display: grid;
    place-items: center;
    width: 80%;
    height: 80%;
    color: white;
    background: blue;
    border-radius: 10px;
  }
`
