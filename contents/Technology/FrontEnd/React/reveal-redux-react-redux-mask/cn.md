---
title: <0>揭开redux，react-redux的神秘面纱</0>
postTime: 2018/12/18 9:27
comment: 4
---

<1>16年开始使用react-redux,迄今也已两年多。这时候再来阅读和读懂redux/react-redux源码，虽已没有当初的新鲜感，但依然觉得略有收获。把要点简单写下来，一方面供感兴趣的读者参考，另一方面也是自己做下总结。</1>

## redux
<2>react-redux最核心的内容就是redux。内带redux，react-redux只提供了几个API来关联redux与react的组件以及react state的更新。</2>

<3>首先，看下如何使用redux。 redux老司机可以直接滑动滚轮至下一章。</3>  
<4>简单来说，redux有三个概念: action, reducer 和 dispatch。 action和dispatch比较好理解：动作指令和提交动作指令方法。而reducer，个人在字面上没有理解，但抽象层面上可以理解为用来生成state的函数。用一个简单案例体现这三个概念：</4>

```js
// action
const INCREMENT = { type: 'INCREMENT' }

// reducer
function count( state = 0, action ) {
    switch( action.type ) {
        case 'INCREMENT':
            return state + 1
        default: 
          return state
    }
}

// dispatch
// <5>此处开始使用redux</5>
const store = redux.createStore( count )
console.log( store.getState() )  // 0
store.dispatch( INCREMENT )
console.log( store.getState() ) // 1
```

<6>接下来说说redux中的两大模块：</6>
* `store`<7>对象</7>
* <8>中间件</8>


## store对象
<9>API`createStore`会创建了一个`store`对象,创建的过程中它主要做了下面两件事：</9>
1. <10>初始化state</10>
2. <11>暴露相关接口：`getState()`, `dispatch( action )`, `subscribe( listener )`等。其中`getState()`用来获取store中的实时state, `dispatch(action)`根据传入的action更新state, `subscribe( listener)`可以监听state的变化。</11>


## <12>中间件</12>
<13>中间件可以用来debug或提交异步动作指令. 在初始化store的时候，我们通过`createStore( reducer, state, applyMiddleware( middleware1, middleware2 ) )`添加多个中间件。  
为了实现多个中间件，redux专门引入了函数式编程的`compose()`方法，简单来说，`compose`将多层函数调用的写法变得优雅：</13>
```js
// <14>未使用compose方法</14>
a( b( c( 'd' ) ) )

// <15>用compose方法</15>
compose( a, b, c )('d')
```
<16>而中间件的写法比较奇特，是多级函数，在阅读源码的时候有点绕。显然中间件的写法还可以优化，尽管现在的写法方便在源码中使用，但对redux用户来说稍显复杂，可以用单层函数。</16>
```js
function logMiddleware({ getState  }) {
    return nextDispatch => action => {
        console.log( 'before dispatch', getState() )
        const res = nextDispatch( action )
        console.log( 'after dispatch', getState() )
        return res
    }
}
```



## react-redux
<17>了解了redux运作原理，就可以知道react-redux的大部分使用场景是如何运作。react-redux提供了几个API将redux与react相互关联。</17>

<18>基于上一个案例展示react-redux的用法：</18>

```jsx
// action
const increment = () => ({ type: 'INCREMENT' })

// reducer
function count( state = 0, action ) {
    switch( action.type ) {
        case 'INCREMENT':
            return state + 1
        default: 
          return state
    }
}

// redux
const store = Redux.createStore( count )

// react-redux
const { Provider, connect } = ReactRedux
const mapStateToProps = state => ( { count: state } )
const mapDispatchToProps = dispatch => ( { increment : () => dispatch( increment() ) } )
const App = connect( mapStateToProps, mapDispatchToProps )( class extends React.Component {
  onClick = () => {
   this.props.increment()
  }  
  render() {
        return <div>
          <p>Count: { this.props.count }</p>
          <button onClick={ this.onClick }>+</button>
        </div>
    }
} )

ReactDOM.render( <Provider store={ store }>
    <App />
</Provider>, document.getElementById( 'app' ) )
```

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/react-redux/demo/index.html?mode=result"></iframe>



<19>react-redux提供最常用的两个API是：</19>
* `Provider`
* `connect`



## `Provider`
<20>Provider本质上是一个react组件，通过react的[context api](https://reactjs.org/docs/legacy-context.html#how-to-use-context)(使一个组件可以跨多级组件传递props)挂载redux store中的state，并且当组件初始化后开始监听state。</20>    
<21>当监听到state改变，Provider会重新`setState`在context上的`storeState`，简要实现代码如下：</21>
```jsx
class Provider extends Component {
    constructor(props) {
      super(props)
    
      const { store } = props
    
      this.state = {
        storeState: Redux.store.getState(),
      }
    }
    
    componentDidMount() {
      this.subscribe()
    }
    
    subscribe() {
        const { store } = this.props
        store.subscribe(() => {
          const newStoreState = store.getState()
          this.setState(providerState => {
            return { storeState: newStoreState }
          })
        })
    }
    render() {
        const Context = React.createContext(null)
        <Context.Provider value={this.state}>
            {this.props.children}
        </Context.Provider>
    }
}
```


## `connect()`
<22>`connect`方法通过`connectHOC`（HOC: react高阶组件）将部分或所有state以及提交动作指令方法赋值给react组件的props。</22>




## <23>小结</23>
<24>写react不用redux就像写代码不用git, 我们需要用redux来更好地管理react应用中的state。了解redux/react-redux的运作原理会消除我们在使用redux开发时的未知和疑惑，并且在脑中有一个完整的代码执行回路，让开发流程变得透明，直观。</24>