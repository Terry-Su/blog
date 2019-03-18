---
postTime: 2017/07/01 18:24
comment: 2
---
Promise is used to **asynchronous computations**.
# The concept of "Promise"


# Introduction
"Synchronize asynchronous methods" is always a hot topic.Here, "Promise" is one way to achieve the goal.


# Promise Model
## Basic Promise Model
![](https://sfault-image.b0.upaiyun.com/513/313/513313002-5957789b7a642_articlex)   


In javascript, it's like:
```js
// #1 Create a "Promise" object
const testPromise = new Promise( (resolve, reject) => {
  // resolve("parameters") or reject("parameters")
  // example 1: setTimeout(resolve, 1000, 'parameters')
  // example 2: setTimeout(reject, 1000, 'parameters')
} )

testPromise.then( value => {
    // #2 Monitor the state of "Promise", if state is "fulfilled"
},  value => {
    // #2 Monitor the state of "Promise", if state is "rejected"
})

```
## Chaining promise model
![](https://sfault-image.b0.upaiyun.com/707/453/707453890-595778c082448_articlex)  
```js
const testPromise = new Promise( (resolve, reject) => {
  // set the state of "Promise" to "fulfilled"
  resolve()
} )

testPromise
    .then( value => {
        // Continue to create "Promise"
        return new Promise( (resolve, reject) => {
            resolve()
        } )
    }, value => {
    })
    .then( value => {
        // Continue to create "Promise"
        return new Promise( (resolve, reject) => {
        resolve('parameters')
        } )
    }, value => {
    })
    .then( value => {
        console.log(value)  // output: 'paramaters'
    }, value => {
    })
```


# Grammar
### Initialize
[Promise constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
### Chain
[Promise.prototype.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
### Catch rejected reason
[Promise.prototype.catch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
### Resolve or reject parameters directly
[Promise.resolve()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
[Promise.reject()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
### Queue
[Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
### Apply fastest promise
[Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)



# Conclusion
There must be lots of ways to synchronize asynchronous methods, however, it's more convenient if a standard emerges so we can build robust program more easily.Obviously, promise is an ideal standard.
