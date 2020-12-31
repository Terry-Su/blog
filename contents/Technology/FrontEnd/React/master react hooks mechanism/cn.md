---
title: 轻松掌握React Hooks底层实现原理
postTime: 2020/12/31 23:55
comment: 13
isAutoTranslated: false
---

由于最近业务较忙，2020年搞懂React原理系列文章最终篇直到现在才在业余时间抽空完成。之前在公司内部已有过一次PPT形式的分享，但经过一段时间对hooks的深度使用，对其又有了更深一些了解，故本次加上新内容并以文章形式再分享一次。

持续一年阅读React源码和总结其核心原理，慢慢也有了一些心得：

读懂源码只是第一步，弄懂其功能的代码实现方式。而再进一步是彻底搞懂其实现原理、思想，它通过什么方式实现了什么功能，带来了什么价值。

不管它的底层代码如何改写，最终的目的都是为了实现某个功能。只要我们把其功能实现原理掌握，便可活学活用，结合业务让业务开发效率更高，或围绕业务做一些生产力工具。


> React使用当前最新版本：`17.0.1`
>
> 今年写了一个“搞懂React源码系列”，把React最核心的内容用最易懂的方式讲清楚。2020年搞懂React源码系列：
> * [React Diff原理](https://terry-su.github.io/cn/understand-react-diff-algorithm-from-source-codes)
> * [React 调度原理](https://terry-su.github.io/cn/undestand-react-scheduling-mechanism-from-source-code-concurrent-mode)
> * [搭建阅读React源码环境-支持React所有版本断点调试细分文件](https://terry-su.github.io/cn/debug-react-source-code-using-special-method)
> * （当前）React Hooks原理
> 
> 少了React Fiber更新原理？那是因为[国外大佬的一篇文章](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)写得太好，没有必要再重复写一次。或许明年可以找个时间写个简明概要的React所有原理汇总文章。

本文将重点讲`useMemo`、`useEffect`和`useState`3个api，因为它们在日常开发中最常用。后面讲其他几个api。本次主要描述每个hook的功能和原理。

## 基础知识
任何一个hook的调用方式都是：
```js
输出 = hook函数(输入)
```
一定会有输入和hook函数和输出。
而被调用的过程一般是2种：组件初始化和组件更新。

## UseMemo实现原理
useMemo的功能是记忆某个结果，只有依赖项发生改变时才更新输出结果。
```js
输出结果 = useMemo(计算函数，依赖项)
```


下方展示其在不同过程中useMemo内部实现原理。

输入| hook函数 | 输出
---|---|---
计算函数，依赖项|useMemo|计算结果

**组件初始化**：
1. 执行计算函数，获取计算结果
2. 缓存结果结果和依赖项
3. 返回计算结果

**组件更新**:
```
if (依赖项和已缓存依赖项相同) {
    返回已缓存计算结果
} else {
    执行计算函数，获取新计算结果
    缓存新计算结果和新依赖项
    返回新计算结果
}
```

> 其中一个问题值得注意，依赖项是如何比较的？深比较或浅比较？因为依赖项一般是一个数组，而数组中的每个元素是具体的依赖变量，那么React是如何比较的？
>
> 翻看源码，发现若两个依赖项都是数组，则React会使用Object.is对其每一个元素进行强比较。

```js
Object.is('foo', 'foo');     // true
Object.is(window, window);   // true

Object.is('foo', 'bar');     // false
Object.is([], []);           // false

var foo = { a: 1 };
var bar = { a: 1 };
Object.is(foo, foo);         // true
Object.is(foo, bar);         // false

Object.is(null, null);       // true

// Special Cases
Object.is(0, -0);            // false
Object.is(-0, -0);           // true
Object.is(NaN, 0/0);         // true
```
> 转念一想，其实就应这样比较。

## UseEffect实现原理
```js
useEffect(创建函数，依赖项)
```

useEffect的主要功能是：

组件加载后执行创建函数，创建函数执行后会返回一个销毁函数，在组件销毁前执行。

若依赖项为数组且不为空，则依赖项改变时，会执行上一个销毁函数和重新执行创建函数。


输入| hook函数 
---|---
创建函数，依赖项|useEffect

useEffect直接被调用的过程是组件初始化和组件更新，其销毁函数被调用的过程是组件销毁。

**组件初始化**：
1. 生成一个effect对象，包含创建函数
2. 缓存effect和依赖项
3. 当React进入提交阶段，执行effect中的创建函数，获取销毁函数。若销毁函数不为空，则将其放入effect。

**组件更新**：
1. 生成一个effect对象, 包含创建函数
2. 检查已缓存effect中是否有销毁函数，有的话则放入新effect对象
3. 缓存effect
4. 若依赖项和已缓存依赖项不同，则将hasEffect标记添加到effect，并缓存新依赖项
5. 当React进入提交阶段：
```
if (effect有hasEffect标记) {
    若effect中有销毁函数，则先执行销毁函数
    执行effect中的创建函数，获取销毁函数。若销毁函数不为空，则将其放入effect
} 
```

**组件销毁**：
1. 若effect中有销毁函数，则执行。


## UseState实现原理
useState的功能是设置一个状态的初始值，并返回当前状态和设置状态的函数。
```js
[状态，设置状态函数] = useState(初始状态)
```

输入| hook函数 | 输出
---|---|---
初始状态|useState|状态，设置状态函数


useState直接被调用的过程也是组件初始化和组件更新，其还有一个调用设置状态函数的过程。


**组件初始化**：
1. 若初始状态为函数，则将函数执行结果设为当前状态。否则将初始状态设为当前状态。
2. 生成设置状态函数
3. 缓存当前状态和设置状态函数
4. 返回当前状态

**组件更新**：
1. 读取缓存状态和设置状态函数
2. 返回缓存状态

**执行设置状态函数**：
1. 更新缓存状态
2. 触发React组件树更新
3. 在下一次组件更新时，将返回已被更新的缓存状态


## useReducer
useReducer的功能和原理与useState一致，区别在于useReducer使用函数管理状态，使用派发动作指令函数作为设置状态函数。Reducer概念可参看redux。
```js
[状态，派发动作指令函数]=useReducer(reducer函数，初始状态)
```

## UseCallback实现原理
```
已缓存函数 = useCallback(待缓存函数，依赖项)
```
useCallback的功能就是useMemo记忆函数一个封装，相比useMemo只是少套了一层函数：
```
已缓存函数 = useMemo( () => 待缓存函数, 依赖项)
```
不过React内部并没有用useMemo直接实现useCallback，而是用一套类似useMemo的代码实现。

## UseRef实现原理
```
{current: 当前值} = useRef(初始当前值)
```
useRef的功能是生成一个对象，结构是：`{current: 当前值}`, 对象一旦初始化，不会因为组件更新而改变。

虽然对象初始化后不会因组件更新改变，但我们可以通过更改其current属性，当前值就相当于一个组件的变量，类似class组件的实例属性。

useRef最常用的场景莫过于设置组件的ref。
```jsx
const container = useRef(null)
return <div ref={container}></div>
```
其实此处官网也有特别讲，div上的ref属性将触发设置`container.current`为dom对象。

但我们也可以把useRef作为生成组件变量的方法灵活应用。

输入| hook函数 | 输出
---|---|---
初始当前值|useRef|{current: 当前值}

**组件初始化**：
1. 生成对象: { current: 初始当前值 }
2. 缓存对象
3. 返回缓存对象

**组件更新**：
1. 获取缓存对象
2. 返回缓存对象


## UseImperativeHandle
useImperativeHandle的功能被子组件使用，实现父组件调用子组件内部方法，一般与forwardRef一起使用。

UseImperativeHandle实现原理与useEffect类似。


## UseLayoutEffect
useLayoutEffect和useLayout的功能区别：

useLayoutEffect | useLayout
---|---
渲染到屏幕前执行 | 渲染到屏幕后执行

```js
useLayoutEffect(() => {
   // 组件初始化或更新在渲染到屏幕前执行
   return () => {
     // 1. 组件卸载前执行 2. 执行下一个effect前执行
   } 
}, )
```



---


在跨年前完成2020搞懂React原理系列文章最后一篇，也是为了迎接即将到来的2021。

在2021年，新的系列即将启航。不过在写新系列前，下一篇将先写微前端框架实现原理。


祝大家新年快乐！