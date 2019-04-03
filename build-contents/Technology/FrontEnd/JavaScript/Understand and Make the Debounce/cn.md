---
title: 防抖-理解，实践并实现
postTime: 2018/9/19 18:02
comment: 2
isAutoTranslated: false

keywords: 防抖 Debounce JavaScript 前端 节流
---

防抖（去抖），以及节流（分流）在日常开发中可能用的不多，但在特定场景，却十分有用。本文主要讨论防抖，镜像文章：[节流 - 理解，实践与实现](https://terry-su.github.io/cn/understand-and-make-the-throttle)。分开讨论防抖和节流，主要是为了让一些还不太了解防抖节流的读者能够有针对性地，逐一掌握它们。   
防抖有**两种模式**（容易让人迷惑）：延时执行和直接执行。后续详细讨论。  
防抖还有一个关键点是如果用代码实现。本文以循序渐进地方式，先以实现一个简单案例为例，绘制流程图，再根据流程图逻辑编写防抖功能代码。



## 典型案例
以日常开发中常用的搜索按钮为例，若用户点击一次搜索按钮后，不小心“手抖”很快又点了一次按钮，防抖可以规避第二次甚至更多次搜索。

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/search/index.html?mode=result" ></iframe>

第一个搜索按钮未做任何防抖处理。  
搜索按钮A为第一种防抖模式：延时执行。若用户连续快速点击多次，只有最后一次点击结束，延时一段时间后才执行搜索。  
搜索按钮B为第二种防抖模式：直接执行。若用户连续快速点击多次，只有第一次点击会执行搜索。

## 防抖是什么
结合上方案例，防抖可以理解为：多次触发事件后，事件处理函数只执行一次。  
而防抖的两种模式可以根据实际使用场景分别应用。


## 应用场景
在搜索框中实时键入文本搜索
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/realtime-search/index.html?mode=result" ></iframe>

防止频繁点击搜索按钮触发搜索请求
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/standard-search/index.html?mode=result" ></iframe>



## 一步步手写防抖
接下来我们通过一个案例梳理实现防抖的思路。  
假设我们要实现本文第一个案例中搜索按钮A的功能。首先整理需求：
1. 点击搜索按钮后，函数并不马上执行，而是等一段时间再执行。 
2. 若在这段时间内，按钮再次被点击，则重新开始计时，等待同样一段时间后再执行。 

实现的方法有两种，推荐第一种，用计时器(setTimeout)简化代码，将重心放在实现防抖的逻辑上。

方法一核心参数：
1. 等待时长
2. 计时器


绘制方法一的流程图：


```
graph TB
开始--> A{计时器是否为空}
A--> |是| B(添加计时器: 过了 等待时长 后, 执行搜索,然后 清除计时器)
A--> |否| C(清除计时器)
C--> B
B--> 结束
```

根据流程图思路实现方法一的防抖代码：

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


方法二核心参数：
1. 等待时长
2. 最早可执行时间

绘制方法二的流程图：
```
graph TB
开始 --> IF1{最早可执行时间 是否定义}
IF1 --> |是| IF2{当前时间 是否 大于或等于 最早可执行时间}
IF1 --> |否| A(设置 最早可执行时间 为 当前时间 加上 等待时长)
IF2 --> |是| B(执行搜索)
IF2 --> |否| A

B --> 结束
A --> 结束
```


根据流程图实现方法二的防抖代码：
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
2. 若在这段时间内按钮被点击，则重新计时。

核心参数：
1. 等待时长
2. 计时器

```
graph TB
开始--> IF1{计时器是否为空}
IF1 --> |是| B(执行搜索)
B--> C(添加计时器: 过了 等待时长 后, 清除计时器)


IF1 --> |否|D(清除计时器)
D--> C

C--> 结束
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

接下来我们使用刚才编写的debounce函数来测试第一个案例

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/test-search/index.html?mode=js" ></iframe>


## 总结
防抖是一个高阶函数，能够将多个事件函数合并为一个，在“调整window尺寸”，“在搜索框中实时搜索键入文本”， “滚动滚动条”和“防止搜索按钮频繁点击触发多余请求”等案例中，十分有用。


## 链接
* Lodash 推荐：https://css-tricks.com/debouncing-throttling-explained-examples
* 简单理解防抖定义：https://www.cnblogs.com/woodyblog/p/6238445.html