---
title: Understand and Make the Throttle
postTime: 2018/9/20 18:27

comment: 3
---

The principle of throttling (shunt) is similar to that of anti-shake (de-shake). This article mainly discusses throttling, mirroring articles:[Anti - shake - understanding, practice and implementation](https://terry-su.github.io/understand-and-make-the-debounce).The main purpose of the separate discussion of control and control is to let some readers who are not familiar with control and control can grasp them one by one.  
How to implement throttling in code is also an important point. This paper adopts the method of step-by-step, first draw a flowchart of the case, and then write the throttling function code according to the logic of the flowchart.



## Throttling case
<br/>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/mousemove/index.html?mode=result" ></iframe>

Mousemove events are frequently triggered when the mouse moves. The top is in unthrottled mode, and each mousemove trigger draws a dot. On the bottom is the throttling mode. Although mosuemove is triggered many times when the mouse moves, it only draws the dots in a limited time interval.


## Understand and implement throttling
From the above example, we can get a basic understanding of the role of throttling: frequently triggered events, event handlers only execute once in a certain time interval.

But how does the throttle function do that? The above scheme is taken as an example and its flow chart is drawn as follows.  

Core parameter: 
1. The interval time
2. The timer

```
graph TB
start --> IF1{Whether the timer is empty}

IF1 --> |is| A(Draw the dot)
A --> B(Add a timer, After the The interval time after, Clear timer)
B --> The end of the

IF1 --> |no| The end of the
```

The fractional flow function is realized according to the flow chart：
```js
function throttle( func, wait ) {
  let timer

  function throttled( ...args ) {
    const self = this

    if ( timer == null ) {
      invokeFunc()
      addTimer()
    }

    function addTimer() {
      timer = setTimeout( () => {
        clearTimer()
      }, wait )
    }

    function invokeFunc() {
      func.apply( self, args )
    }
  }

  return throttled

  function clearTimer() {
    clearTimeout( timer )
    timer = null
  }
}
```

Next, implement the above example with the throttling function you wrote
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/test-mousemove/index.html?mode=result" ></iframe>



## Application scenarios
Unlimited scroll bars
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/infinite-scrolling/index.html?mode=result" ></iframe>



## conclusion
Similar to throttling and stabilization, both can effectively optimize system performance, but using business scenarios makes a difference：
* Anti-shake can be used for events that are triggered multiple times (such as text box input text one by one), or for events that are triggered frequently (such as resizing a window).
* Throttling is mostly used for frequently triggered events such as scroll bars.