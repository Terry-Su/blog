---
title: <0>Understand and Make the Throttle
postTime: 2018/9/20 18:27
</0>
comment: 3
---

<1>The principle of throttling (shunt) is similar to that of anti-shake (de-shake). This article mainly discusses throttling, mirroring articles:</1>[<2>Anti - shake - understanding, practice and implementation</2>](<34>https://terry-su.github.io/understand-and-make-the-debounce</34>)<5>.</5><3>The main purpose of the separate discussion of control and control is to let some readers who are not familiar with control and control can grasp them one by one.</3>  
<4>How to implement throttling in code is also an important point. This paper adopts the method of step-by-step, first draw a flowchart of the case, and then write the throttling function code according to the logic of the flowchart.</4>



## <6>Throttling case</6>
<br/>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/mousemove/index.html?mode=result" ></iframe>

<7>Mousemove events are frequently triggered when the mouse moves. The top is in unthrottled mode, and each mousemove trigger draws a dot. On the bottom is the throttling mode. Although mosuemove is triggered many times when the mouse moves, it only draws the dots in a limited time interval.</7>


## <8>Understand and implement throttling</8>
<9>From the above example, we can get a basic understanding of the role of throttling: frequently triggered events, event handlers only execute once in a certain time interval.</9>

<10>But how does the throttle function do that? The above scheme is taken as an example and its flow chart is drawn as follows.</10>  

<11>Core parameter</11>: 
1. <12>The interval time</12>
2. <13>The timer</13>

```
graph TB
<22>start</22> --> IF1{<23>Whether the timer is empty</23>}

IF1 --> |<24>is</24>| A(<25>Draw the dot</25>)
A --> B(<26>Add a timer,</26> <27>After the</27> <28>The interval time</28> <29>after</29>, <30>Clear timer</30>)
B --> <31>The end of the</31>

IF1 --> |<32>no</32>| <33>The end of the</33>
```

<14>The fractional flow function is realized according to the flow chart</14>：
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

<15>Next, implement the above example with the throttling function you wrote</15>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/test-mousemove/index.html?mode=result" ></iframe>



## <16>Application scenarios</16>
<17>Unlimited scroll bars</17>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/infinite-scrolling/index.html?mode=result" ></iframe>



## <18>conclusion</18>
<19>Similar to throttling and stabilization, both can effectively optimize system performance, but using business scenarios makes a difference</19>：
* <20>Anti-shake can be used for events that are triggered multiple times (such as text box input text one by one), or for events that are triggered frequently (such as resizing a window).</20>
* <21>Throttling is mostly used for frequently triggered events such as scroll bars.</21>