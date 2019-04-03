---
<95>title: 防抖-理解，实践并实现</95>
postTime: 2018/9/19 18:02
comment: 2
<94>isAutoTranslated: false
</94>
keywords: <97>防抖 Debounce JavaScript 前端 节流</97>
---

<0>防抖（去抖），以及节流（分流）在日常开发中可能用的不多，但在特定场景，却十分有用。本文主要讨论防抖，镜像文章</0>：[<1>节流</1> - <2>理解，实践与实现</2>](<96>https://terry-su.github.io/cn/understand-and-make-the-throttle</96>)<4>。</4><3>分开讨论防抖和节流</3>，<5>主要是为了让一些还不太了解防抖节流的读者能够有针对性地，逐一掌握它们</5>。   
<6>防抖有</6>**<7>两种模式</7>**（<8>容易让人迷惑</8>）：<9>延时执行和直接执行。后续详细讨论。</9>  
<10>防抖还有一个关键点是如果用代码实现。本文以循序渐进地方式，先以实现一个简单案例为例，绘制流程图，再根据流程图逻辑编写防抖功能代码。</10>



## <11>典型案例</11>
<12>以日常开发中常用的搜索按钮为例，若用户点击一次搜索按钮后，不小心“手抖”很快又点了一次按钮，防抖可以规避第二次甚至更多次搜索。</12>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/search/index.html?mode=result" ></iframe>

<13>第一个搜索按钮未做任何防抖处理。</13>  
<14>搜索按钮A为第一种防抖模式：延时执行。若用户连续快速点击多次，只有最后一次点击结束，延时一段时间后才执行搜索。</14>  
<15>搜索按钮B为第二种防抖模式：直接执行。若用户连续快速点击多次，只有第一次点击会执行搜索。</15>

## <16>防抖是什么</16>
<17>结合上方案例，防抖可以理解为：多次触发事件后，事件处理函数只执行一次。 </17> 
<18>而防抖的两种模式可以根据实际使用场景分别应用。</18>


## <19>应用场景</19>
<20>在搜索框中实时键入文本搜索</20>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/realtime-search/index.html?mode=result" ></iframe>

<21>防止频繁点击搜索按钮触发搜索请求</21>
<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/standard-search/index.html?mode=result" ></iframe>



## <22>一步步手写防抖</22>
<23>接下来我们通过一个案例梳理实现防抖的思路。</23>  
<24>假设我们要实现本文第一个案例中搜索按钮A的功能。首先整理需求</24>：
1. <25>点击搜索按钮后，函数并不马上执行，而是等一段时间再执行。</25> 
2. <26>若在这段时间内，按钮再次被点击，则重新开始计时，等待同样一段时间后再执行。</26> 

<27>实现的方法有两种，推荐第一种，用计时器(setTimeout)简化代码，将重心放在实现防抖的逻辑上。</27>

<28>方法一核心参数</28>：
1. <29>等待时长</29>
2. <30>计时器</30>


<31>绘制方法一的流程图</31>：


```
graph TB
<32>开始</32>--> A{<33>计时器是否为空</33>}
A--> |<34>是</34>| B<35>(添加计时器</35>: <36>过了</36> <37>等待时长</37> <38>后</38>, <39>执行搜索,然后</39> <40>清除计时器</40>)
A--> |<41>否</41>| C(<42>清除计时器</42>)
C--> B
B--> 结束
```

<43>根据流程图思路实现方法一的防抖代码</43>：

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


<44>方法二核心参数</44>：
1. <45>等待时长</45>
2. <46>最早可执行时间</46>

<47>绘制方法二的流程图</47>：
```
graph TB
<48>开始</48> --> IF1{<49>最早可执行时间</49> <50>是否定义</50>}
IF1 --> |<51>是</51>| IF2{<52>当前时间</52> <53>是否</53> <54>大于或等于</54> <55>最早可执行时间</55>}
IF1 --> |<56>否</56>| A(<57>设置</57> <58>最早可执行时间</58> <59>为</59> <60>当前时间</60> <61>加上</61> <62>等待时长</62>)
IF2 --> |<63>是</63>| B(<64>执行搜索</64>)
IF2 --> |<65>否</65>| A

B --> <66>结束</66>
A --> <67>结束</67>
```


<68>根据流程图实现方法二的防抖代码</68>：
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
2. <72>若在这段时间内按钮被点击，则重新计时。</72>

<73>核心参数：</73>
1. <74>等待时长</74>
2. <75>计时器</75>

```
graph TB
<76>开始</76>--> IF1{<77>计时器是否为空</77>}
IF1 --> |<78>是</78>| B(<79>执行搜索</79>)
B--> C(<80>添加计时器</80>: <81>过了</81> <82>等待时长</82> <83>后</83>, <84>清除计时器</84>)


IF1 --> |<85>否</85>|D(<86>清除计时器</86>)
D--> C

C--> <87>结束</87>
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

<88>接下来我们使用刚才编写的debounce函数来测试第一个案例</88>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/debounce/test-search/index.html?mode=js" ></iframe>


## <89>总结</89>
<90>防抖是一个高阶函数，能够将多个事件函数合并为一个，在“调整window尺寸”，“在搜索框中实时搜索键入文本”， “滚动滚动条”和“防止搜索按钮频繁点击触发多余请求”等案例中，十分有用。</90>


## <91>链接</91>
* Lodash <92>推荐</92>：https://css-tricks.com/debouncing-throttling-explained-examples
* <93>简单理解防抖定义</93>：https://www.cnblogs.com/woodyblog/p/6238445.html