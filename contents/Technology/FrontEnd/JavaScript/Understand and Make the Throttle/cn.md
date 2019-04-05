---
title: <0>节流 - 理解，实践与实现
postTime: 2019/3/2 11:00
</0>
comment: 3
---

<1>节流(分流)，与防抖（去抖）实现原理相似。本文主要讨论节流，镜像文章：</1>[<2>防抖 - 理解，实践与实现</2>](<34>https://terry-su.github.io/cn/understand-and-make-the-debounce</34>)<5>。</5><3>分开讨论防抖和节流，主要是为了让一些还不太了解节流防抖的读者能够有针对性地，逐一掌握它们。</3>  
<4>如何用代码实现节流也是一个要点。本文采用循序渐进地方式，先绘制一个案例的流程图，再根据流程图的逻辑编写节流功能代码。</4>



## <6>节流案例</6>
<br/>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/mousemove/index.html?mode=result" ></iframe>

<7>当鼠标移动时，mousemove事件频繁被触发。上方为未节流模式，每一次mousemove触发都会绘制一个圆点。而下方为节流模式，尽管mosuemove在鼠标移动时被多次触发，但只有在限定时间间隔才会绘制圆点。</7>


## <8>理解和实现节流</8>
<9>通过上方案例，可以基本了解节流的作用: 频繁触发的事件，事件处理函数在一定的时间间隔内只执行一次。</9>

<10>不过节流函数是如何做到的？ 以上方案例为例，绘制其流程图如下。</10>  

<11>核心参数</11>: 
1. <12>间隔时长</12>
2. <13>计时器</13>

```
graph TB
<22>开始</22> --> IF1{<23>计时器是否为空</23>}

IF1 --> |<24>是</24>| A(<25>绘制圆点</25>)
A --> B(<26>添加计时器,</26> <27>过了</27> <28>间隔时长</28> <29>后</29>, <30>清除计时器</30>)
B --> <31>结束</31>

IF1 --> |<32>否</32>| <33>结束</33>
```

<14>根据流程图的思路实现分流函数</14>：
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

<15>接下来，用编写的节流函数实现上方案例</15>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/test-mousemove/index.html?mode=result" ></iframe>



## <16>应用场景</16>
<17>无限的滚动条</17>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/throttle/infinite-scrolling/index.html?mode=result" ></iframe>



## <18>总结</18>
<19>节流和防抖类似，都能有效优化系统性能，不过使用业务场景有所区别</19>：
* <20>防抖既可用于在多次触发的事件（如文本框逐个输入文字），也可用于在频繁触发的事件（如调整窗口尺寸）。</20>
* <21>节流多只用在频繁触发的事件（如滚动滚动条）上。</21>