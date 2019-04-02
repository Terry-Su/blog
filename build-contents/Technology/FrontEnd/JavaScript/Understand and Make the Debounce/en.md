---
title: Understand and Make the Debounce
postTime: 2018/9/19 18:02
comment: 2
isAutoTranslated: true
---

Anti-shake (de-shake) and throttling (shunt) may not be used much in daily development, but they are useful in certain scenarios. This article mainly discusses anti - shake, mirror article：[The throttle - Understanding, practice and implementation](https://terry-su.github.io/understand-and-make-the-throttle)。Discuss shake control and throttling separately，The main purpose is to let some readers who are not familiar with anti - shake throttle can be targeted, master them one by one。   
If you have**Two modes**（It's confusing）：Delay execution and direct execution. More on this later.  
The other key point is if you implement it in code. In this paper, step by step, first to achieve a simple case as an example, draw a flowchart, and then according to the flow chart logic to write anti-shake function code.



## Typical cases
Take the search button commonly used in daily development as an example. If the user clicks the search button once and accidentally "shakes" the button again soon, the anti-shake can avoid the second or even more searches.

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/search/index.html?mode=result" ></iframe>

The first search button does nothing to prevent shaking.  
Search button A is the first anti-shake mode: delay execution. If the user clicks several times in a row, and only the last click ends, the search will be executed after a time delay.  
Search button B for the second anti - shake mode: direct execution. If the user clicks quickly multiple times in a row, only the first click will perform the search.

## What is anti-shake
Combined with the above case, the anti-shake can be understood as: after triggering events for many times, the event handler only executes once. 
And the two modes of anti - shake can be applied according to the actual situation.


## Application scenarios
Type a text search in real time in the search box
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/realtime-search/index.html?mode=result" ></iframe>

Prevent frequent clicking of the search button from triggering a search request
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/standard-search/index.html?mode=result" ></iframe>



## Step by step handwriting anti - shake
Next we comb through a case to achieve the idea of anti - shake.  
Suppose we want to implement the function of the search button A in the first example of this article. First, sort out the requirements：
1. When the search button is clicked, the function does not execute immediately, but rather waits a while to execute. 
2. If the button is clicked again during this time, the timer starts again and waits for the same time before executing. 

There are two methods of implementation, the first is recommended, using a timer (setTimeout) to simplify the code, focus on the implementation of the logic of the anti-shake.

Method one core parameter：
1. The waiting time
2. The timer


Draw a flowchart for method 1：


```
graph TB
start--> A{Whether the timer is empty}
A--> |is| B(add timer: After the The waiting time after, Perform the search and then Clear timer)
A--> |no| C(Clear timer)
C--> B
B--> 结束
```

According to the flow of ideas to achieve method 1 anti - shake code：

```js
function debounce( func, wait = 0 ) {
  let timer
  
  function debounced( ...args ) {
    const self = this
    if ( timer == null ) {
      addTimer()
      return
    }

    if ( timer != null ) {
      clearTimer()
      addTimer()
      return
    }

    function addTimer() {
      timer = setTimeout( () => {
        invokeFunc()
        clearTimer()
      }, wait )
    }

    function invokeFunc() {
      func.apply( self, args )
    }
  }

  return debounced

  function clearTimer() {
    clearTimeout( timer )
    timer = null
  }
}
```


Method two core parameters：
1. The waiting time
2. Earliest executable time

Draw a flowchart of method 2：
```
graph TB
start --> IF1{Earliest executable time Whether the definition}
IF1 --> |is| IF2{The current time Whether or not Greater than or equal to Earliest executable time}
IF1 --> |no| A(Set up the Earliest executable time for The current time add The waiting time)
IF2 --> |is| B(Perform a search)
IF2 --> |no| A

B --> The end of the
A --> The end of the
```


According to the flow chart to achieve method two anti - shake code：
```js
function debounce( func, wait = 0 ) {
  // Earliest time when func can be invoked
  let earliest
  
  function debounced( ...args ) {
    const self = this
    
    if ( typeof earliest === 'undefined' ) {
      setEarliset()
    }

    if ( typeof earliest !== 'undefined' ) {
      if ( now() >= earliest ) {
        invokeFun()
      } else {
        setEarliset()
      }
    }

    function setEarliset() {
      earliest = now() + wait
    }

    function invokeFun() {
      func.apply( self, args )
    }
  }

  return debounced

  function now() {
    return +new Date()
  }
}
```


同样，我们可以使用类似方法实现搜索按钮B的功能。
需求描述：
1. 点击搜索按钮后，函数马上执行。只有等待一段时间后被点击才能执行函数。
2. If the button is clicked during this time, the timer is reset.

Core parameter：
1. The waiting time
2. The timer

```
graph TB
start--> IF1{Whether the timer is empty}
IF1 --> |is| B(Perform a search)
B--> C(Add timer: After the The waiting time after, Clear timer)


IF1 --> |no|D(Clear timer)
D--> C

C--> The end of the
```

```js
function debounce( func, wait = 0 ) {
  let timer
  
  function debounced( ...args ) {
    const self = this

    timer == null && invokeFunc()

    timer != null && clearTimer()
    
    timer = setTimeout( clearTimer, wait )

    function invokeFunc() {
      func.apply( self, args )
    }
  }

  return debounced

  function clearTimer() {
    clearTimeout( timer )
    timer = null
  }
}
```

Now let's test the first case using the debounce function I wrote earlier

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/test-search/index.html?mode=js" ></iframe>


## conclusion
Anti-shake is a high-order function that can combine multiple event functions into one. It is useful in such cases as "resize window", "search for typed text in the search box in real time", "scroll bar" and "prevent search button from frequently clicking to trigger redundant requests".


## link
* Lodash recommended：https://css-tricks.com/debouncing-throttling-explained-examples
* Simple understanding of the definition of anti - shake：https://www.cnblogs.com/woodyblog/p/6238445.html