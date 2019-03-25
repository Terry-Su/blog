---
title: <0>Uncover the mystery of redux, react-redux</0>
postTime: 2018/12/18 9:27
comment: 4
---

<1>React -redux was adopted in 2016 and has been around for more than two years. At this time, I would like to read and understand the source code of redux/react-redux. Although it is not as fresh as before, I still feel I have gained something. Write down the main points, on the one hand for interested readers reference, on the other hand is to make a summary.</1>

## redux
<2>The react-redux core is redux. In-band redux, react-redux provides only a few apis to associate redux with components on react and react state updates.</2>

<3>First, let's look at how to use redux. Old redux drivers can slide the rollers directly to the next chapter.</3>  
<4>In a nutshell, redux has three concepts: action, reducer, and dispatch. Action and dispatch are well understood: action instructions and commit action instruction methods. While reducer is not understood by individuals literally, but it can be understood as a function to generate state at the abstract level. Use a simple example to illustrate these three concepts:</4>

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
// <5>Redux is used here</5>
const store = redux.createStore( count )
console.log( store.getState() )  // 0
store.dispatch( INCREMENT )
console.log( store.getState() ) // 1
```

<6>Here are the two modules in redux:</6>
* `store`<7>object</7>
* <8>The middleware</8>


## store对象
<9>API ` createStore ` will create a ` store ` objects, the process of creating it mainly do the following two things:</9>
1. <10>Initialize the state</10>
2. <11>Expose relevant interface: ` getState () `, ` dispatch (action) `, ` subscribe (the listener) `, etc. The ` getState () ` used to retrieve the real time state, store ` dispatch (action) the action to update the state of the incoming ` according to ` subscribe (the listener) ` can monitor the change of the state.</11>


## <12>The middleware</12>
<13>Middleware can be used to debug or submit asynchronous instruction. At the time of initialization store, we through ` createStore (reducer, the state, applyMiddleware (middleware1 middleware2)) ` add multiple middleware.

In order to realize the multiple middleware, redux specially the introduction of functional programming ` compose ` () method, in simple terms, ` compose ` layers of function call writing become elegant:</13>
```js
// <14>The compose method is not used</14>
a( b( c( 'd' ) ) )

// <15>With the compose method</15>
compose( a, b, c )('d')
```
<16>And the middleware is written in a strange way, is a multi - level function, when reading the source code a little around. Obviously, the middleware approach can be optimized, and although the current approach is easy to use in source code, it is slightly more complex for redux users to use single-layer functions.</16>
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
<17>Once you understand how redux works, you can see how much of the react-redux usage scenario works. React -redux provides several apis to correlate redux with react.</17>

<18>Based on the previous case showing the use of react-redux:</18>

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



<19>The two most commonly used apis react-redux provides are:</19>
* `Provider`
* `connect`



## `Provider`
<20>The Provider is essentially a react components, through the react [context API] (https://reactjs.org/docs/legacy-context.html#how-to-use-context) (props for a component can span multiple components transfer) mount redux state in the store, and when the component is initialized to start listening to the state.</20>    
<21>When listening to the state change, the Provider will return ` setState ` in the context of ` storeState `, briefly the implementation code is as follows:</21>
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
<22>` connect ` method through ` connectHOC ` (HOC: react high-order component) to submit part or all of the state and action method assigned to react component props.</22>




## <23>summary</23>
<24>Writing react without redux is like writing code without git, we need to use redux to better manage state on the react application. Understanding how redux/react-redux works will eliminate the unknowns and confusion we had when developing with redux and have a complete code execution loop in mind, making the development process transparent and intuitive.</24>