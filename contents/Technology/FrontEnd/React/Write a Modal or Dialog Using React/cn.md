---
title: <1>使用React手写一个对话框或模态框</1>
postTime: 2019/4/23 15:00
comment: <0>6</0>
components:
  ModalApp: components/ModalApp.js
---

![](https://user-images.githubusercontent.com/23733477/56563695-f17a9b00-65de-11e9-969f-f98977e7e9a1.png)

<2>打算用React写对话框已经很长一段时间，现在是时候兑现承诺了。实际上，写起来相当简单。</2>

<3>核心在于使用React的接口`React.createPortal(element, domContainer)`。该接口将`element`渲染后的DOM节点嵌入`domContainer`(通常是`document.body`)，并保证只嵌入一次。</3>

<4>所以，我们可以这样写一个对话框或模态框：</4>
```jsx
function Dialog() {
    return React.createPortal( <div>Dialog contents</div>, document.body )
}
```

<6>一个新的`div`会出现在`body`内部：</6>
![image](https://user-images.githubusercontent.com/23733477/56560376-d86dec00-65d6-11e9-95f5-bcfb31fcf16f.png)


<7>一个完整DEMO:</7>

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



<5>是不是很简单?</5>
