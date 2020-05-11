---
title: 彻底搞懂React源码中的调度原理（Concurrent模式）
postTime: 2020/5/11 11:23
comment: 11
isAutoTranslated: false
---
自上一篇写关于diff的文章到现在已经过了二十天多，利用业余时间和10天婚假的闲暇，终于搞懂了React源码中的调度原理。当费劲一番周折终于调试到将更新与调度任务连接在一起的核心逻辑那一刻，忧愁的嘴角终于露出欣慰的微笑。

最早之前，React还没有用fiber重写，那个时候对React调度模块就有好奇。而现在的调度模块对于之前没研究过它的我来说更是带有一层神秘的色彩，色彩中朦胧浮现出两个字：“困难”。

截至目前react的Concurrent（同时）调度模式依然处在实验阶段（期待中），还未正式发布，但官网已有相关简单介绍的文档，相信不久之后就会发布（参考hooks）。

在研究的时候也查阅了网上的相关资料，但可参考的不多。原因一个是调度模块源码变动较大，之前的一些文章和现在的源码实现对不上（不过很多文章对时间切片和优先级安排的概念讲解很到位），另一个是现在可参考的列出调度流程相应源码的文章几乎没有。

所以本文主要是通过字自己对源码的阅读，推理和验证，加上大量时间作为催化剂，将React源码中的调度原理展现给各位读者。

> React使用当前最新版本：`16.13.1`
>
> 今年会写一个“搞懂React源码系列”，把React最核心的内容用最易懂的方式讲清楚。2020年搞懂React源码系列：
> * React Diff原理
> * （当前）React 调度原理
> * 搭建阅读React源码环境-支持React所有版本断点调试细分文件
> * React Hooks原理

## 同步调度模式
React目前只有一种调度模式：同步模式。只有等Concurrent调度模式正式发布，才能使用第两种模式。

没有案例的讲解是没有灵魂的。我们先来看一个此处和后续讲优先级都将用到的案例：

假设有一个按钮和有8000个包含同样数字的文本标签，点击按钮后数字会加2。（使用8000个文本标签是为了加长react单次更新任务的计算时间，以便直观观察react如何执行多任务）

我们用类组件实现案例。

渲染内容：

```html
<div>
  <button ref={this.buttonRef} onClick={this.handleButtonClick}>增加2</button>
  <div>
    {Array.from(new Array(8000)).map( (v,index) =>
      <span key={index}>{this.state.count}</span>
    )}
  </div>
</div>
```
添加按钮点击事件：
```js
handleButtonClick = () => {
  this.setState( prevState => ({ count: prevState.count + 2 }) )
}
```
并在`componentDidMount`中添加如下代码：
```js
const button = this.buttonRef.current
setTimeout( () => this.setState( { count: 1 } ), 500 )
setTimeout( () => button.click(), 500 )
```

ReactDOM初始化组件：
```js
ReactDOM.render(<SyncSchedulingExample />, document.getElementById("container"));
```

添加2个setTimeout是为了展示同步模式的精髓： 500毫秒后有两个异步的setState的任务，由于react要计算和渲染8000个文本标签，那么任何一个任务光计算的时间都要几百毫秒，那么react会如何处理这两个任务？

运行案例后，查看Chrome性能分析图：

![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/1-cn.png)

从结果可知，尽管两个任务理应“同时”运行，但react会先把第一个任务执行完后再执行第二个任务，这就是react同步模式：

多个任务时，react都会按照任务顺序一个一个执行，它无法保证后面的任务能在本应执行的时间执行。（其实就是JS本身特性EventLoop的展现。比如只要一个while循环足够久，理应在某个时刻执行的方法就会被延迟到while循环结束后才运行。）

## Concurrent（同时）调度模式
Concurrent调度模式是一种支持**同时执行多个更新任务**的调度模式。

它的特点是任何一个更新任务都可以被更高优先级中断插队，在高优先级任务执行之后再执行。

很重要的一点，"同时执行多个更新任务"指的是同时将多个更新任务添加到React调度的任务队列中，然后React会一个个执行，而不是类似多线程同时工作那种方式。

### 如何理解模式名字：Concurrent(同时)？
React官网用了一个很形象的版本管理案例来形容“同时”模式。

当我们没有版本管理软件的时候，若一个人要修改某个文件，需要通知其他人不要修改这个文件，只有等他修改完之后才能去修改。无法做到多个人同时修改一个文件。

但有了版本管理软件，我们每个人都可以拉一个分支，修改同一个文件，然后将自己修改的内容合并到主分支上，做到多人“同时”修改一个文件。

所以，如果React也能做到“同时”执行多个更新任务，做到每一个更新任务的执行不会阻塞其他更新任务的加入，岂不是很方便。

这可以看作是“同时”模式名字的由来。

### 同时调度模式的应用场景
下方为React团队成员Dan在做同时模式分享时用的DEMO。同样的快速输入几个数字，在同步模式和同时模式可发现明显区别。

[Dan-Concurrent Mode Demo](https://codesandbox.io/s/koyz664q35):

![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/dan-input-demo.gif)

同步模式下，卡顿现象明显，并且会出现UI阻塞状态：Input中的光标不再闪烁，而是卡住。

同时模式下，只有输入内容较长才会出现稍微的卡顿情况和UI阻塞。性能得到明显改善。

同时模式很好的解决了连续频繁更新状态场景下的卡顿和UI阻塞问题。当然，同时模式下还有其他实用功能，比如Suspense，因为本文主要讲调度原理和源码实现，所以就不展开讲Suspense了。

### 同步调度模式如何实现
React是如何实现同步调度模式的？这也是本文的核心。接下来将先讲时间切片模式，以及React如何实现时间切片模式，然后再讲调度中的优先级，以及如何实现优先级插队，最后讲调度的核心参数：expirationTime（过期时间）。


## 时间切片
![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/time-slicing-demo.png)
### 什么是时间切片
最早是从Lin Clark分享的[经典Fiber演讲](https://www.youtube.com/watch?v=ZCuYPiUIONs)中了解到的时间切片。时间切片指的是一种将多个粒度小的任务放入一个个时间切片中执行的一种方法。

### 时间切片的作用 
在刚执行完一个时间切片准备执行下一个时间切片前，React能够：

* 判断是否有用户界面交互事件和其他需要执行的代码，比如点击事件，有的话则执行该事件

* 判断是否有优先级更高的任务需要执行，如果有，则中断当前任务，执行更高的优先级任务。也就是利用时间前片来实现高优先级任务插队。

即时间切片有两个作用：

1. 在执行任务过程中，不阻塞用户与页面交互，立即响应交互事件和需要执行的代码

2. 实现高优先级插队

### React源码如何实现时间切片
1. 首先在这里引入当前React版本中的一段注释说明：

> // Scheduler periodically yields in case there is other work on the main
> // thread, like user events. By default, it yields multiple times per frame.
> // **It does not attempt to align with frame boundaries, since most tasks don't**
> // **need to be frame aligned**; for **those that do, use requestAnimationFrame**.
> let yieldInterval = 5;

注释对象是声明`yieldInterval`变量的表达式，值为5，即5毫秒。其实这就是React目前的单位时间切片长度。

注释中说一个帧中会有多个时间切片（显而意见，一帧~=16.67ms，包含3个时间切片还多），切片时间不会与帧对齐，如果要与帧对齐，则使用`requestAnimationFrame`。

从2019年2月27号开始，React调度模块[移除了之前的requestIdleCallback腻子脚本相关代码](https://github.com/facebook/react/commit/00748c53e183952696157088a858352cc77b0010?diff=split#diff-603a307ec39e05daabd1c651dc2ffb15)。

![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/react-remove-requestIdleCallback-polyfill.png)

所以在一些之前的调度相关文章中，会提到React如何使用`requestAnimationFrame`实现`requestIdleCallback`腻子脚本，以及计算帧的边界时间等。因为当时的调度源码的确使用了这些来实现时间切片。不过现在的调度模块代码已精简许多，并且用新的方式实现了时间切片。

2. 了解时间切片实现方法前需掌握的知识点：

* `Message Channel`：浏览器提供的一种数据通信接口，可用来实现订阅发布。其特点是其两个端口属性支持双向通信和异步发布事件（`port.postMessage(...)`）。

```js
const channel = new MessageChannel()
const port1 = channel.port1
const port2 = channel.port2

port1.onmessage = e => { console.log( e.data ) }
port2.postMessage('from port2')
console.log( 'after port2 postMessage' )

port2.onmessage = e => { console.log( e.data ) }
port1.postMessage('from port1')
console.log( 'after port1 postMessage' )

// 控制台输出: 
// after port2 postMessage
// after port1 postMessage
// from port2
// from port1
```

* `Fiber`: Fiber是一个的节点对象，React使用链表的形式将所有Fiber节点连接，形成链表树，即虚拟DOM树。
当有更新出现，React会生成一个工作中的Fiber树，并对工作中Fiber树上每一个Fiber节点进行计算和[diff](https://terry-su.github.io/cn/understand-react-diff-algorithm-from-source-codes)，完成计算工作（React称之为渲染步骤）之后，再更新DOM（提交步骤）。


3. 下面让我们来看React究竟如何实现时间切片。

首先React会默认有许多微小任务，即所有的工作中fiber节点。

在执行调度工作循环和计算工作循环时，执行每一个工作中Fiber。但是，有一个条件是每隔5毫秒，会跳出工作循环，运行一次**异步的`MessageChannel`的`port.postMessage(...)`方法，检查是否存在事件响应、更高优先级任务或其他代码需要执行**，如果有则执行，如果没有则重新创建工作循环，执行剩下的工作中Fiber。

![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/time-slicing-demo.png)

但是，为什么性能图上显示的切片不是精确的5毫秒？

因为一个时间切片中有多个工作中fiber执行，每执行完一个工作中Fiber，都会检查开始计时时间至当前时间的间隔是否已超过或等于5毫秒，如果是则跳出工作循环，但算上检查的最后一个工作中fiber本身执行也有一段时间，所以最终一个时间切片时间一定大于或等于5毫秒。

时间切片和其他模块的实现原理对应源码位于本文倒数第二章节“源码实探”。

将描述和实际源码分开，是为了方便阅读。先用大白话把原理实现流程讲出来，不放难懂的源码，最后再贴出对应源码。


# 如何调度一个任务

讲完时间切片，就可以了解React如何真正的调度一个任务了。
![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/frame-lifecycle.png)

`requestIdleCallback(callback, { timeout: number })`是浏览器提供的一种可以让回调函数执行在每帧（上图2个`vsync`之间即为1帧）末尾的空闲阶段的方法，配置timeout后，若多帧持续没有空闲时间,超过timeout时长后，该回调函数将立即被执行。  

现在的React调度模块虽没有使用`requestIdleCallback`,但充分吸收了`requestIdleCallback`的理念。其`unstable_scheduleCallback(priorityLevel, callback, { timeout: number })`就是类似的实现，不过是针对不同优先级封装的一种调度任务的方法。

在讲调度流程前先简单介绍调度中用到的相关参数：

* 当前Fiber树的root：拥有属性“回调函数”

* React中的调度模块的任务： 拥有属性 “优先级，回调函数，过期时间”

* 过期时间标记：源码中expirationTime有两种类型，一种是标记类型：一个极大值，大小与时长成反比，可以用来作优先级标记，值越大，优先级越高，比如：`1073741551`；另一种是从网页加载开始计时的具体过期时间：比如8000毫秒）。具体内容详见后面的expirationTime章节

* DOM调度配置： 因为react同时支持web端dom和移动端native两种，核心算法一致，但有些内容是两端独有的，所以有的模块有专门的DOM配置和Native配置。我们这里将用到调度模块的DOM配置

* `requestHostCallback`：DOM调度配置中使用`Message Channel`异步执行回调函数的方法

接下来看React如何调度一个任务。

### 初始化
1. 当出现新的更新，React会运行一个确保root被安排任务的函数。

2. 当root的回调函数为空值且新的更新对应的过期时间标记是异步类型，根据当前时间和过期时间标记推断出优先级和计算出timeout，然后根据优先级、timeout， 结合执行工作的回调函数，新建一个任务（这里就是`scheduleCallback`），将该任务放入任务队列中，调用DOM调度配置文件中的`requestHostCallback`,回调函数为调度中心的清空任务方法。

### 运行任务
1. `requestHostCallback`调用MessageChannel中的异步函数：`port.postMessage(...)`，从而异步执行之前另一个端口`port1`订阅的方法，在该方法中，执行`requestHostCallback`的回调函数，即调度中心的清空任务方法。

2.清空任务方法中，会执行调度中心的工作循环，循环执行任务队列中的任务。

有趣的是，工作循环并不是执行完一次任务中的回调函数就继续执行下一个任务的回调函数，而是执行完一个任务中的回调函数后，检测其是否返回函数。若返回，则将其作为任务新的回调函数，继续进行工作循环；若未返回，则执行下一个任务的回调函数。

并且工作循环中也在检查5毫秒时间切片是否到期，到期则重新调`port.postMessage(...)`。

3. 任务的回调函数是一个执行同时模式下root工作的方法。执行该方法时将循环执行工作中fiber，同样使用5毫秒左右的时间切片进行计算和diff，5毫秒时间切片过期后就会返回其自身。

### 完成任务
1. 在执行完所有工作中fiber后，React进入提交步骤，更新DOM。

2. 任务的回调函数返回空值，调度工作循环因此（运行任务步骤中第二点：若任务的回调函数执行后返回为空，则执行下一个任务）完成此任务，并将此任务从任务队列中删除。



## 如何实现优先级
目前有6种优先级（从高到低排序）：
|   优先级类型   |   使用场景   | 
| ---- | ---- |
| 立即执行ImmediatePriority | React内部使用：过期任务立即同步执行；用户自定义使用 |
| 用户与页面交互UserBlockingPriority | React内部使用：用户交互事件生成此优先级任务；用户自定义使用 |
| 普通NormalPriority | React内部使用：默认优先级；用户自定义使用 |
| 低LowPriority | 用户自定义使用 |
| 空闲IdlePriority | 用户自定义使用 |
| 无NoPriority | React内部使用：初始化和重置root；用户自定义使用 |
表格中列出了优先级类型和使用场景。React内部用到了除低优先级和空闲优先级以外的优先级。理论上，用户可以自定义使用所有优先级，使用方法:
```js
React.unstable_scheduleCallback(priorityLevel, callback, { timeout: <number> })
```


不同优先级的作用就是让高优先级任务优先于低优先级任务执行，并且由于时间切片的特性（每5毫秒执行一次异步的`port.postMessage(...)`，在执行相应回调函数前会执行检测到的需要执行的代码）高优先级任务的加入可以中断正在运行的低优先级任务，先执行完高优先级任务，再重新执行被中断的低优先级让任务。

高优先级插队也是同时调度模式的核心功能之一。

### 高优先级插队
接下来，使用类似同步模式代码的插队案例。
渲染内容：
```html
<div>
  <button ref={this.buttonRef} onClick={this.handleButtonClick}>增加2</button>
  <div>
    {Array.from(new Array(8000)).map( (v,index) =>
      <span key={index}>{this.state.count}</span>
    )}
  </div>
</div>
```
添加按钮点击事件：
```js
handleButtonClick = () => {
  this.setState( prevState => ({ count: prevState.count + 2 }) )
}
```
并在`componentDidMount`中添加如下代码（不同之处，第二次setTimeout的时间由500改为600）：
```js
const button = this.buttonRef.current
setTimeout( () => this.setState( { count: 1 } ), 500 )
setTimeout( () => button.click(), 600)
```
ReactDOM初始化组件（不同之处，使用React.createRoot开启Concurrent模式）：
```js
ReactDOM.createRoot( document.getElementById('container') ).render( <ConcurrentSchedulingExample /> )
```
为什么第二次setTimeout的时间由500改为600？

因为是为了展示高优先级插队。第二次setTimeout使用的用户交互优先级更新，晚100毫秒，可保证第一次setTimeout对应的普通更新正在执行中，还没有完成，这个时候最能体现插队效果。

![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/insert-high-priority-demo.gif)

运行案例后，页面默认显示8000个0，然后0变为2（而不是变为1），再变为3。

通过DOM内容的变化已经可以看出：第二次setTimeout执行的按钮点击事件对应的更新插了第一次setTimeout对应更新的队。

接下来，观察性能图。
总览：
![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/concurrent-insert-high-priority-cn.png)
被中断细节：只执行了3个时间切片就被中断：
![](http://localhost:5000/assets/blogs/understand-react-scheduling-mechanism/concurrent-insert-high-priority-detail.png)

### 如何实现高优先级插队
1. 延用上面的高优先级插队案例，从触发高优先级点击事件（准备插队）开始。

触发点击事件后，React会运行内部的合成事件相关代码，然后执行一个执行优先级的方法，优先级参数为“用户交互UserBlockingPriority”，接着进行`setState`操作。

`setState`的关联方法新建一个更新，计算当前的过期时间标记，然后开始安排工作。

2. 在安排工作方法中，运行确保root被安排任务的方法。因为现在的优先级更高且过期时间标记不同，调度中心取消对之前低优先级任务的安排，并将之前低优先级任务的回调置空，确保它之后不会被执行（调度中心工作循环根据当前的任务的回调函数是否为空决定是否继续执行该任务）。

然后调度中心根据高优先级更新对应的优先级、过期时间标记、timeout等创建新的任务。

3. 执行高优先级任务，当执行到开始计算工作中类Fiber（`class ConcurrentSchedulingExample`），执行更新队列方法时，React将循环遍历工作中类fiber的更新环状链表。

**当循环到之前低优先级任务对应更新时，因为低优先级过期时间标记小于当前渲染过期时间标记，故将该低优先级过期时间标记设为工作中类fiber的过期时间标记（其他情况会将工作中类fiber的过期时间标记设为0）**。此处是之后恢复低优先级的关键所在。

4. 在完成优先级任务过程的提交渲染DOM步骤中，渲染DOM后，会将root的callbackNode（其名字容易误导其功能，其实就是调度任务，用callbackTask或许更合适）设为空值。

在接下来执行确保root被安排任务的方法中，因为下一次过期时间标记不为空（根本原因就是上面第二点提到工作中类fiber的过期时间标记被设置为低优先级过期时间标记）且root的callbackNode为空值，所以创建新的任务，即重新创建一个新的低优先级任务。并将任务放入任务列表中。

5. 重新执行低优先级任务。此处需要注意是重新执行而不是从之前中断的地方继续执行。毕竟React计算过程中只有当前fiber树和工作中fiber树，执行高优先级时，工作中fiber树已经被更新，所以恢复低优先级任务一定是重新完整执行一遍。



## 过期时间ExpirationTime
作为贯穿整个调度流程的参数，过期时间ExpirationTime的重要性不言而喻。

但在调试过程中，发现expirationTime却不止一种类型。它的值有时是`1073741121`，有时又是`6500`，两个值显示对应不同类型。为什么会出现这种情况？

> 事实上，当前Reac正在重写ExpirationTime的功能，如果后续看到这篇文章发现跟源码差别较大，欢迎阅读我之后写的解读新ExpirationTime功能的文章（立个FLAG先，主要后面expirationTime一块变化应该不小，值得研究）。
### ExpirationTime的变化过程
以上方优先级插队为例，观察expirationTime值及其相关值的变化。

* 更新低优先级

|   过程   |   时间相关参数   |   值   |
| ---- | ---- | ---- |
|  `setState(...) -->`<br/> `var expirationTime = computeExpirationForFiber(currentTime, ...)`    |  `currentTime`    |   1073741 641   |
|      |   `expirationTime=computeExpirationForFiber(currentTime, ...)`   |  1073741 121    |
|   `ensureRootIsScheduled(...) -->` <br/>`timeout = expirationTimeToMs(expirationTime) - now()`   |  `expirationTimeToMs(expirationTime)`    |  7000    |
|      |   `now()`   |   1808   |
|      |   `timeout = expirationTimeToMs(expirationTime) - now()`   |   5192   |
|      |   `startTime`   |  1808    |
|      |   `timeout`   |   5192   |
|      |   `expirationTime = startTime + timeout`   |   7000   |

在设置更新时，会根据当前优先级和当前时间标记生成对应过期时间标记。

而此后，在确保和安排任务时，会将过期时间标记转换为实际过期时间。

表格的第二第三过程转了一圈，最后还是回到第一次计算的过期时间（因为js同步执行少量代码过程中，performance.now()的变化几乎可以忽略）。

* 中断低优先级更新，更新高优先级

| 过程 | 时间相关参数  |   值   |
| ---- | ---- | ---- |
| `setState(...) -->`<br/>`var expirationTime = computeExpirationForFiber(currentTime, ...)` | `currentTime` | 1073741 630 |
| | expirationTime=computeExpirationForFiber(currentTime, ...) | 1073741 571 |
| `ensureRootIsScheduled(...) -->` `timeout = expirationTimeToMs(expirationTime) - now()` | `expirationTimeToMs(expirationTime)` | 2500 |
| | `now()` | 1916 |
| | `timeout = expirationTimeToMs(expirationTime) - now()` | 584 |
|`unstable_scheduleCallback() -->`<br/>`var expirationTime = startTime + timeout` |  `startTime` |  1916 |
|  | `timeout` |  584 |
|  | `expirationTime = startTime + timeout` |  2500 |
| `processUpdateQueue(...)-->`<br/>`if ( updateExpirationTime ` `<` ` renderExpirationTime ){` <br/>`newExpirationTime = updateExpirationTime` <br/>`}`  |  `updateExpirationTime` | 1073741 121 |
|  | `renderExpirationTime`  |  1073741 571 |
|  | `newExpirationTime = updateExpirationTime` |  1073741 121 |

执行高优先级时，低优先级被中断。而能够让低优先级被恢复的核心逻辑就是最后一个过程（执行更新队列）中对`updateExpirationTime`（低优先级更新的过期时间标记）和`renderExpirationTime`（高优先级更新的过期时间标记）的判断。

因为低优先级过期时间标记小于高优先级过期时间标记，即低优先级过期时间大于高优先级过期时间（过期时间标记与过期时间成反比，下面会讲到），表明低优先级更新已经被插队，需要重新执行。所以低优先级更新过期时间标记设为工作中类fiber的过期时间标记。

* 重新更新低优先级

| 过程 | 时间相关参数  |   值   |
| ---- | ---- | ---- |
|`ensureRootIsScheduled(...) -->`<br/> `timeout = expirationTimeToMs(expirationTime) - now()` | `expirationTimeToMs(expirationTime)` | 7000 |
|  | `now()` | 2066 |
|  | `timeout = expirationTimeToMs(expirationTime) - now()` |  4934 | 
|`unstable_scheduleCallback(...) -->`<br/> `var expirationTime = startTime + timeout`  | `startTime`  | 2066 | 
|  | `timeout` |  4934 | 
|  | `expirationTime = startTime + timeout` |  7000 | 


## 过期时间的两种类型
通过观察expirationTime值的变化过程，可知在设置更新时，计算的expiraionTime为一种标记形式，而到安排任务的时候，任务的expirationTime已变为实际过期时间。

`expirationTime`的2种类型:

1. 时间标记：一个极大值，如`1073741121`

2. 过期时间：从网页加载开始计时的实际过期时间，单位为毫秒

### 过期时间标记
React成员Andrew Clark在"[Make ExpirationTime an opaque type](https://github.com/facebook/react/commit/db6513914f99c260090f26f0a547ee1432c934e6) "中提到了expirationTime作为标记的计算方法和作用：

> In the old reconciler, **expiration times are computed by applying an
> offset to the current system time**. **This has the effect of increasing
> the priority of updates as time progresses**. 

他说ExpirationTime是通过给当前系统时间添加一个偏移量来计算，这样的作用是随着时间运行能够提升更新的优先级。

而源码中，expirationTime的确是根据一个最大整数值偏移量来计算：

MAGIC_NUMBER_OFFSET - ceiling(MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE)

其中：
* `MAGIC_NUMBER_OFFSET `是一个极大常量: `1073741 821`
* UNIT_SIZE也是常量：`10`，用来将毫秒值除以10，比如1000毫秒转为`1000/10=100`，便于展示时间标记
* `ceiling(num, unit)`的作用是根据单位长度进行特殊向上取整（对基础值也向上取整，比如1.1特殊向上取整后为2，而1特殊向上取整后也为2, 可以理解为 Math.floor( num + 1 )  ）
```js
function ceiling(num, unit) {
  return ((num / unit | 0) + 1) * unit;
}
```
`num | 0`的作用类似`Math.floor(num)`, 向下取整，并且加1可以放入括号，所以代码可转换为：
```js
function ceiling(num, unit) {
  return Math.floor( num / unit + 1 ) * unit;
}
```
比如，若单位`unit`为10,若数值`num`为:

* * 10，则返回20
* * 11，也返回20

为什么要React要使用特殊向上取整方法？

因为这样可以实现”更新节流“：在单位时间（比如100毫秒）内，保证多个同等优先级更新计算出的`expirationTime`相同，只执行第一个更新对应的任务（但计算更新时会用到所有更新）。

在确保root被安排好任务的函数中，会判断新的更新`expirationTime`和正在执行的更新`expirationTime`是否相同，以及它们的优先级是否相同，若相同，则直接`return`。从而不会执行第一个更新之后更新对应的任务。

但这并不是说之后的更新都不会执行。由于第一个更新对应任务的执行是异步的（`post.postMessage`），在第一个更新执行更新队列时，其他更新早已被加入更新队列，所以能确保计所有更新参与计算。

* `MAGIC_NUMBER_OFFSET - currentTime`的值为`performance.now()/10`
* `expirationInMs `表示不同优先级对应的过期时长:
* * 普通/低优先级：5秒
* * 高优先级（用户交互优先级）：生产环境下为150毫秒，开发环境下为500毫秒
* * 立即优先级、空闲优先级不通过上面的公式计算，它们的过期时间标记值分别为`1`和`2`,一个表示立即过期，另一个表示永不过期。
* `bucketSizeMs`: 即`ceiling(num, unit)`中的`unit`，作为特殊向上取整的单位长度。高优先级为100毫秒，普通/低优先级为250毫秒。

为了便于理解，不考虑更新节流，则：
```js
过期时间标记值 = 极大数值 - ( 当前时间 + 优先级对应过期时长 ) / 10
```
而`当前时间 + 优先级对应过期时长`就是实际过期时间，所以：
```js
过期时间标记值 = 极大数值 - 过期时间 / 10
```

### 过期时间
过期时间就是：
```js
当前时间 + 优先级对应过期时长 
```

过期时间标记转换为过期时间：
```js
function expirationTimeToMs(expirationTime) {
    return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}
```


## 源码实探
写到此处，不知不觉已经过了好几天。对于源码展现这一块，也有了不同的打算。之前计划纯用流程图展现。但因为涉及关键代码量大，流程图不是很适用。所以这次直接用流程叙述+相关源码，直观的实现原理对应源码。
### 时间切片源码
在执行调度工作循环和计算工作循环时，执行每一个工作中Fiber。但是，有一个条件是每隔5毫秒，会跳出工作循环，

```js
function workLoop(...) {
    ...
    while (currentTask !== null && ...) {
        ....
    }
    ...
}
```
> 调度工作循环


```js
  function workLoopConcurrent() {
    while (workInProgress !== null && !shouldYield()) {
      workInProgress = performUnitOfWork(workInProgress);
    }
  }
```

> 计算工作循环中，`shouldYield()`即为检查5毫秒是否到期的条件


```js
shouldYield(...) --> Scheduler_shouldYield(...) --> unstable_shouldYield(...)
--> shouldYieldToHost(...)
--> getCurrentTime() >= deadline
-->
  var yieldInterval = 5; var deadline = 0;
  var performWorkUntilDeadline = function() {
      ...
      var currentTime = getCurrentTime()
      deadline = currentTime + yieldInterval
      ...
  }
```

> `var yieldInterval = 5`为每隔5毫秒的体现


运行一次**异步的`MessageChannel`的`port.postMessage(...)`方法，检查是否存在事件响应、更高优先级任务或其他代码需要执行**，如果有则执行，如果没有则重新创建工作循环，执行剩下的工作中Fiber。
```js
var channel = new MessageChannel();
var port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
requestHostCallback = function(callback) {
    ...
    if (...) {
        ...
        port.postMessage(null);
    }
}
```

在执行调度任务过程中，会执行`requestHostCallback(...) `, 从而调用`port.postMessage(...)`


### 调度一个任务源码
#### 初始化
1. 当出现新的更新，React会运行一个确保root被安排任务的函数。
```js
setState(...) --> enqueueSetState(...) 
--> scheduleWork(...) --> ensureRootIsScheduled(...)
```

2. 当root的回调函数为空值且新的更新对应的过期时间标记是异步类型，根据当前时间和过期时间标记推断出优先级和计算出timeout，

```js
var currentTime = requestCurrentTimeForUpdate();
var priorityLevel = inferPriorityFromExpirationTime(currentTime, expirationTime);
if (expirationTime === Sync) {
    ...
} else {
    callbackNode = scheduleCallback(priorityLevel, performConcurrentWorkOnRoot.bind(null, root), 
    {
    timeout: expirationTimeToMs(expirationTime) - now()
    });
}
```

然后根据优先级、timeout， 结合执行工作的回调函数，新建一个任务（这里就是`scheduleCallback`），

```js
function unstable_scheduleCallback(priorityLevel, callback, options) {
    ...
    var expirationTime = startTime + timeout;
    var newTask = {
      id: taskIdCounter++,
      callback: callback,
      priorityLevel: priorityLevel,
      startTime: startTime,
      expirationTime: expirationTime,
      sortIndex: -1
    };
    ...
}
```

将该任务放入任务队列中，调用DOM调度配置文件中的`requestHostCallback`,回调函数为调度中心的清空任务方法。

```js
push(taskQueue, newTask);
...
if (...) {
    ...
    requestHostCallback(flushWork);
 }
```

`flushWork`为调度中心的清空任务方法，即将任务队列中的任务执行后然后移除

#### 运行任务
1. `requestHostCallback`调用MessageChannel中的异步函数：`port.postMessage(...)`，

```js
var channel = new MessageChannel();
var port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
requestHostCallback = function (callback) {
  scheduledHostCallback = callback;

  if (...) {
    ...
    port.postMessage(null);
  }
};
```

从而异步执行之前另一个端口`port1`订阅的方法，在该方法中，执行`requestHostCallback`的回调函数，即调度中心的清空任务方法。

```js
var performWorkUntilDeadline = function () {
    ...
    var hasMoreWork = scheduledHostCallback(...);
}
```

2.清空任务方法中，会执行调度中心的工作循环，循环执行任务队列中的任务。

```js
function flushWork(...) {
    ...
    return workLoop(...);
    ...
}
```

有趣的是，工作循环并不是执行完一次任务中的回调函数就继续执行下一个任务的回调函数，而是执行完一个任务中的回调函数后，检测其是否返回函数。若返回，则将其作为任务新的回调函数，继续进行工作循环；若未返回，则执行下一个任务的回调函数。

```js
function workLoop(...) {
    ...
    while (currentTask !== null && ...) {
        var callback = currentTask.callback;
        if (callback !== null) {
            currentTask.callback = null;
            ...
            var continuationCallback = callback(didUserCallbackTimeout)
            if (typeof continuationCallback === 'function') {
                currentTask.callback = continuationCallback;
                ...
            }    
        } else {
            pop(taskQueue)
        }
        currentTask = peek(taskQueue);
    }
    ...
}
```

并且工作循环中也在检查5毫秒时间切片是否到期，到期则重新调`port.postMessage(...)`。

```js
while(currentTask !== null && ...) {
    ...
    if (... && (... || shouldYieldToHost())) {
        break;
    }
    ...
}
if (currentTask !== null) {
    return true;
}
```

```js
var hasMoreWork = scheduledHostCallback(...);

if (!hasMoreWork) {
    ...
} else {
  port.postMessage(null);
}
```

3. 任务的回调函数是一个执行同时模式下root工作的方法。执行该方法时将循环执行工作中fiber，同样使用5毫秒左右的时间切片进行计算和diff，5毫秒时间切片过期后就会返回其自身。

```js
function performConcurrentWorkOnRoot(...) {
    ...
    do {
    try {
      workLoopConcurrent();
      break;
    } catch (...) {
      ...
    }
    } while (true);
    ...
    return performConcurrentWorkOnRoot.bind(...);
}
```

#### 完成任务
1. 在执行完所有工作中fiber后，React进入提交步骤，更新DOM。

```js
finishConcurrentRender(...)-->commitRoot(...)-->commitRootImpl(...)
```

2. 任务的回调函数返回空值，调度工作循环因此（运行任务步骤中第二点：若任务的回调函数执行后返回为空，则执行下一个任务）完成此任务，并将此任务从任务队列中删除。

```js
function performConcurrentWorkOnRoot() {
    ...
    if (workInProgress !== null) { ... }
    else {
        ...
        finishConcurrentRender(root, finishedWork, workInProgressRootExitStatus, expirationTime);
    } 
    ...
    return null;
}
```

```js
function workLoop(...) {
    ...
    while (currentTask !== null && ...) {
        var callback = currentTask.callback;
        if (callback !== null) {
            currentTask.callback = null;
            ...
            var continuationCallback = callback(didUserCallbackTimeout)
            if (typeof continuationCallback === 'function') {
                currentTask.callback = continuationCallback;
                ...
            }    
        } else {
            pop(taskQueue)
        }
        currentTask = peek(taskQueue);
    }
    ...
}
```


### 高优先级插队
1. 延用上面的高优先级插队案例，从触发高优先级点击事件（准备插队）开始。

触发点击事件后，React会运行内部的合成事件相关代码，然后执行一个执行优先级的方法，优先级参数为“用户交互UserBlockingPriority”，接着进行`setState`操作。

```js
onClick --> discreteUpdates 
--> runWithPriority(UserBlockingPriority, ...)
-->setState
```

`setState`的关联方法新建一个更新，计算当前的过期时间标记，然后开始安排工作。

```js
enqueueSetState: function (...) {
    ...
    var expirationTime = computeExpirationForFiber(...);
    var update = createUpdate(...);
    ...
    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
}
```

2. 在安排工作方法中，运行确保root被安排任务的方法。因为现在的优先级更高且过期时间标记不同，调度中心取消对之前低优先级任务的安排，并将之前低优先级任务的回调置空，确保它之后不会被执行（调度中心工作循环根据当前的任务的回调函数是否为空决定是否继续执行该任务）。

```js
function ensureRootIsScheduled(...) {
     if (existingCallbackNode !== null) {
         ...
         cancelCallback(existingCallbackNode);
     }
     ...
}
```

```js
function unstable_cancelCallback(task) {
    ...
    task.callback = null;
}
```

然后调度中心根据高优先级更新对应的优先级、过期时间标记、timeout等创建新的任务。

```js
var expirationTime = startTime + timeout;
var newTask = {
  ...
  callback: callback,
  priorityLevel: priorityLevel,
  startTime: startTime,
  expirationTime: expirationTime,
  ...
};
```


3. 执行高优先级任务，当执行到开始计算工作中类Fiber（`class ConcurrentSchedulingExample`），执行更新队列方法时，React将循环遍历工作中类fiber的更新环状链表。**当循环到之前低优先级任务对应更新时，因为低优先级过期时间标记小于当前渲染过期时间标记，故将该低优先级过期时间标记设为工作中类fiber的过期时间标记（其他情况会将工作中类fiber的过期时间标记设为0）**。此处是之后恢复低优先级的关键所在。

```js
function processUpdateQueue(...) {
    ...
    var newExpirationTime = NoWork;
    ...
    if (updateExpirationTime < renderExpirationTime) {
        if (updateExpirationTime > newExpirationTime) {
            newExpirationTime = updateExpirationTime;
        }
    } else { ... }
    ...
    workInProgress.expirationTime = newExpirationTime
    ...
}
```

> `NoWork`为`0`

4. 在完成优先级任务过程的提交渲染DOM步骤中，渲染DOM后，会将root的callbackNode（其名字容易误导其功能，其实就是调度任务，用callbackTask或许更合适）设为空值。

```js
function commitRootImpl(...) {
    ...
    root.callbackNode = null;
    ...
}
```

在接下来执行确保root被安排任务的方法中，因为下一次过期时间标记不为空（根本原因就是上面第二点提到工作中类fiber的过期时间标记被设置为低优先级过期时间标记）且root的callbackNode为空值，所以创建新的任务，即重新创建一个新的低优先级任务。并将任务放入任务列表中。

```js
function ensureRootIsScheduled(...) {
    var expirationTime = getNextRootExpirationTimeToWorkOn(...);
    if (expirationTime === NoWork) { ... return }
    if (expirationTime === Sync) { ... }
    else {
        callbackNode = scheduleCallback(priorityLevel, performConcurrentWorkOnRoot.bind(null, root), 
      {
        timeout: expirationTimeToMs(expirationTime) - now()
      });
    }
}
```

```js
function unstable_scheduleCallback(priorityLevel, callback, options) {
    ...
    var expirationTime = startTime + timeout;
    var newTask = {
      ...
      callback: callback,
      priorityLevel: priorityLevel,
      startTime: startTime,
      expirationTime: expirationTime,
     ...
    };
    ...
    push(taskQueue, newTask);
    ...
}
```

5. 重新执行低优先级任务。此处需要注意是重新执行而不是从之前中断的地方继续执行。毕竟React计算过程中只有当前fiber树和工作中fiber树，执行高优先级时，工作中fiber树已经被更新，所以恢复低优先级任务一定是重新完整执行一遍。


## 最后写点什么
此次阅读源码的一些心得：

1. 先自上而下，再自下而上。

自上而下是先了解源码的整体结构，总的执行流程是怎样，再一层一层往下研究。而自下而上是着重研究某个功能的细节，弄懂细节之后再研究其上层。

2. 面向问题看源码。

在研究某个功能时，先提出问题，再研究源码解决问题。不过若有问题尝试很久都无法解决，可以先放下，继续研究其他问题，之后再回来解决。

3. 调试源码。

对于非常简单的功能，一般只看源码就能弄懂。但其他功能，往往只有经过调试才能能验证和推理，从而真正弄懂。下一篇会写如何搭建**支持所有React版本断点调试细分文件**的React源码调试环境。
