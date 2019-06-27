---
title: Write a Modal or Dialog Using React
postTime: 2019/4/23 15:00
comment: 17
components:
  ModalApp: components/ModalApp.js
---
![](https://user-images.githubusercontent.com/23733477/56563695-f17a9b00-65de-11e9-969f-f98977e7e9a1.png)

Having planned to write a dialog using React for a long time, now, it's the time to fullfill the promise. As a matter of fact, it's pretty easy.

The key is the use of React interface `React.createPortal(element, domContainer)`, which inserts the mounted node of `element` into `domContainer`(ofter `document.body`) only **once**.

So, we're able to create a dialog or modal like this:
```jsx
function Dialog() {
    return React.createPortal( <div>Dialog contents</div>, document.body )
}
```

And a new `div` will come out under the `body`:
![image](https://user-images.githubusercontent.com/23733477/56560376-d86dec00-65d6-11e9-95f5-bcfb31fcf16f.png)


A complete demo:

<ModalApp />

```jsx

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
    background: white;
    border-radius: 10px;
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12);
  }
`
```



Isn't it pretty simple? 
