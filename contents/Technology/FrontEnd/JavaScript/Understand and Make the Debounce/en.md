---
<95>title: Understand and Make the Debounce</95>
postTime: 2018/9/19 18:02
comment: 2
<94>isAutoTranslated: true</94>
---

<0>Anti-shake (de-shake) and throttling (shunt) may not be used much in daily development, but they are useful in certain scenarios. This article mainly discusses anti - shake, mirror article</0>：[<1>The throttle</1> - <2>Understanding, practice and implementation</2>](<96>https://terry-su.github.io/understand-and-make-the-throttle</96>)<4>。</4><3>Discuss shake control and throttling separately</3>，<5>The main purpose is to let some readers who are not familiar with anti - shake throttle can be targeted, master them one by one</5>。   
<6>If you have</6>**<7>Two modes</7>**（<8>It's confusing</8>）：<9>Delay execution and direct execution. More on this later.</9>  
<10>The other key point is if you implement it in code. In this paper, step by step, first to achieve a simple case as an example, draw a flowchart, and then according to the flow chart logic to write anti-shake function code.</10>



## <11>Typical cases</11>
<12>Take the search button commonly used in daily development as an example. If the user clicks the search button once and accidentally "shakes" the button again soon, the anti-shake can avoid the second or even more searches.</12>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/search/index.html?mode=result" ></iframe>

<13>The first search button does nothing to prevent shaking.</13>  
<14>Search button A is the first anti-shake mode: delay execution. If the user clicks several times in a row, and only the last click ends, the search will be executed after a time delay.</14>  
<15>Search button B for the second anti - shake mode: direct execution. If the user clicks quickly multiple times in a row, only the first click will perform the search.</15>

## <16>What is anti-shake</16>
<17>Combined with the above case, the anti-shake can be understood as: after triggering events for many times, the event handler only executes once.</17> 
<18>And the two modes of anti - shake can be applied according to the actual situation.</18>


## <19>Application scenarios</19>
<20>Type a text search in real time in the search box</20>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/realtime-search/index.html?mode=result" ></iframe>

<21>Prevent frequent clicking of the search button from triggering a search request</21>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/standard-search/index.html?mode=result" ></iframe>



## <22>Step by step handwriting anti - shake</22>
<23>Next we comb through a case to achieve the idea of anti - shake.</23>  
<24>Suppose we want to implement the function of the search button A in the first example of this article. First, sort out the requirements</24>：
1. <25>When the search button is clicked, the function does not execute immediately, but rather waits a while to execute.</25> 
2. <26>If the button is clicked again during this time, the timer starts again and waits for the same time before executing.</26> 

<27>There are two methods of implementation, the first is recommended, using a timer (setTimeout) to simplify the code, focus on the implementation of the logic of the anti-shake.</27>

<28>Method one core parameter</28>：
1. <29>The waiting time</29>
2. <30>The timer</30>


<31>Draw a flowchart for method 1</31>：


```
graph TB
<32>start</32>--> A{<33>Whether the timer is empty</33>}
A--> |<34>is</34>| B<35>(add timer</35>: <36>After the</36> <37>The waiting time</37> <38>after</38>, <39>Perform the search and then</39> <40>Clear timer</40>)
A--> |<41>no</41>| C(<42>Clear timer</42>)
C--> B
B--> 结束
```

<43>According to the flow of ideas to achieve method 1 anti - shake code</43>：

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


<44>Method two core parameters</44>：
1. <45>The waiting time</45>
2. <46>Earliest executable time</46>

<47>Draw a flowchart of method 2</47>：
```
graph TB
<48>start</48> --> IF1{<49>Earliest executable time</49> <50>Whether the definition</50>}
IF1 --> |<51>is</51>| IF2{<52>The current time</52> <53>Whether or not</53> <54>Greater than or equal to</54> <55>Earliest executable time</55>}
IF1 --> |<56>no</56>| A(<57>Set up the</57> <58>Earliest executable time</58> <59>for</59> <60>The current time</60> <61>add</61> <62>The waiting time</62>)
IF2 --> |<63>is</63>| B(<64>Perform a search</64>)
IF2 --> |<65>no</65>| A

B --> <66>The end of the</66>
A --> <67>The end of the</67>
```


<68>According to the flow chart to achieve method two anti - shake code</68>：
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


<69>同样，我们可以使用类似方法实现搜索按钮B的功能。</69>
<70>需求描述</70>：
1. <71>点击搜索按钮后，函数马上执行。只有等待一段时间后被点击才能执行函数。</71>
2. <72>If the button is clicked during this time, the timer is reset.</72>

<73>Core parameter</73>：
1. <74>The waiting time</74>
2. <75>The timer</75>

```
graph TB
<76>start</76>--> IF1{<77>Whether the timer is empty</77>}
IF1 --> |<78>is</78>| B(<79>Perform a search</79>)
B--> C(<80>Add timer</80>: <81>After the</81> <82>The waiting time</82> <83>after</83>, <84>Clear timer</84>)


IF1 --> |<85>no</85>|D(<86>Clear timer</86>)
D--> C

C--> <87>The end of the</87>
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

<88>Now let's test the first case using the debounce function I wrote earlier</88>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/test-search/index.html?mode=js" ></iframe>


## <89>conclusion</89>
<90>Anti-shake is a high-order function that can combine multiple event functions into one. It is useful in such cases as "resize window", "search for typed text in the search box in real time", "scroll bar" and "prevent search button from frequently clicking to trigger redundant requests".</90>


## <91>link</91>
* Lodash <92>recommended</92>：https://css-tricks.com/debouncing-throttling-explained-examples
* <93>Simple understanding of the definition of anti - shake</93>：https://www.cnblogs.com/woodyblog/p/6238445.html