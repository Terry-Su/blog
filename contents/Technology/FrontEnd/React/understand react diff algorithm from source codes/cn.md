---

title: 搞懂React源码系列-React Diff原理

postTime: 2020/4/9 9:00

comment: 10

isAutoTranslated: false

---
![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/react-diff.jpg)


时隔2年，重新看React源码，很多以前不理解的内容现在都懂了。本文将用实际案例结合相关React源码，集中讨论React Diff原理。使用当前最新React版本：`16.13.1`。



另外，今年将写一个“搞懂React源码系列”，把React**最核心内容**用最通俗易懂地方式讲清楚。2020年搞懂React源码系列：

* React Diff原理

* React 调度原理

* 搭建阅读React源码环境-支持所有版本断点调试

* React Hooks原理



在讨论Diff算法前，有必要先介绍React Fiber，因为React源码中各种实现都是基于Fiber，包括Diff算法。当然，熟悉React Fiber的朋友可跳过Fiber介绍。



## Fiber简介

Fiber并不复杂，但如果要[全面理解](https://zhuanlan.zhihu.com/p/57346388)，还是得花好一段时间。本文主题是diff原理，所以这里仅简单介绍下Fiber。

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/fiber.png)

Fiber是一个抽象的节点对象，每个对象可能有子Fiber(child)和相邻Fiber(child)和父Fiber(return),React使用链表的形式将所有Fiber节点连接，形成链表树。



Fiber还有副作用标签(effectTag)，比如替换Placement(替换)和Deletion(删除)，用于之后更新DOM。



值得注意的是，React diff中，除了fiber，还用到了基础的[React元素对象](https://reactjs.org/docs/glossary.html#elements)（如： 将`<div>foo</div>`编译后生成的对象: `{ type: 'div', props: { children: 'foo' } }` ）。



## Diff 过程

React源码中，关于diff要从`reconcileChildren(...)`说起。

总流程：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/flowchart-main.svg)



流程图中, 显示源码中用到的函数名，省略复杂参数。“新内容”即被比较的新内容，它可能是三种类型：

* 对象： React元素

* 字符串或数字： 文本

* 数组：数组元素可能是React元素或文本



## 新内容为React元素

我们先以新内容为React元素为例，全面的调试一遍代码，将之后会重复用到的方法在此步骤中讲解，同时以一张流程图作为总结。



案例：

```js

function SingleElementDifferentTypeChildA() { return <h1>A</h1> }

function SingleElementDifferentTypeChildB() { return <h2>B</h2> }

function SingleElementDifferentType() {

 const [ showingA, setShowingA ] = useState( true ) 

 useEffect( () => {

  setTimeout( () => setShowingA( false ), 1000 )

 } )

 return showingA ? <SingleElementDifferentTypeChildA/> : <SingleElementDifferentTypeChildB/>

}

ReactDOM.render( <SingleElementDifferentType/>, document.getElementById('container') )

```





从第一步`reconcileChildren(...)`开始调试代码，无需关注与diff不相关的内容，比如`renderExpirationTime`。左侧调试面板可看到对应变量的类型。

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/1.png)

此处:

* `workInProgress`: 父级Fiber

* `current.child`: 处于比较中的旧内容对应fiber

* `nextChildren`: 即处于比较中的新内容, 为React元素，其类型为对象。



**在Diff时**，比较中的**旧内容为Fiber**,而比较中的**新内容为React元素、文本或数组**。其实从这一步已经可以看出，React官网的[diff算法说明](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm)和实际代码是实现差别较大。

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/2.png)

因为新内容为对象，所以继续执行`reconcileSingleElement(...)`和`placeSingleChild(...)`。



我们先看`placeSingleChild(...)`：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/3.png)



`placeSingleChild(...)`的作用很简单，给differ后的Fiber添加副作用标签：Placement（替换），表明在之后需要将旧Fiber对应的DOM元素进行替换。



继续看 `reconcileSingleElement(...)`:

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/4.png)

**此处正式开始diff(比较)**，child为旧内容fiber，element为新内容，它们的**元素类型**不同。



![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/5.png)

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/6.png)

因为类型不同，React将“删除”旧内容fiber以及其所有相邻Fiber（即给这些fiber添加副作用标签 Deletion（删除））， 并基于新内容生成新的Fiber。然后将新的Fiber设置为父Fiber的child。



到此，一个新内容为React元素的且新旧内容的元素类型不同的Diff过程已经完成。



那如果新旧内容的元素类型相同呢？

编写类似案例，我们可以得到结果

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/7.png)

`userFiber(...)`：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/8.png)

`userFiber(...)`的主要作用是基于旧内容fiber和新内容的属性（props）克隆生成一个新内容fiber，这也是所谓的fiber复用。



所以当新旧内容的元素类容相同，React会复用旧内容fiber，结合新内容属性，生成一个新的fiber。同样，将新的fiber设置位父fiber的child。



新内容为React元素的diff流程总结：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/flowchart-react-element.svg)



## 新内容为文本

当新内容为文本时，逻辑与新内容为React元素时类似：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/flowchart-text.svg)



## 新内容为数组

使用案例：

```js

function ArrayComponent() {

  const [ showingA, setShowingA ] = useState( true ) 

  useEffect( () => {

   setTimeout( () => setShowingA( false ), 1000 )

  } )

  return showingA ? <div>

​    <span>A</span>

​    <span>B</span>

  </div> : <div>

​    <span>C</span>

​    D

  </div>

}

ReactDOM.render( <ArrayComponent/>, document.getElementById('container') )

```



![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/9.png)

若新内容为数组，需`reconcileChildrenArray(...)`:

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/10.png)

for循环遍历新内容数组，伪代码（用于理解）：
```js
for ( let i = 0, oldFiber; i < newArray.length; ) {

  ...

  i++

  oldFiber = oldFiber.sibling
}
```





遍历每个新内容数组元素时：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/11.png)



`updateSlot(...)`:

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/12.png)

因为`newChild`的类型为`object`, 所以：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/13.png)



`updateElement(...)`:

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/14.png)



`updateElement(...)`与`reconcileSingleElement(...)`核心逻辑一致：

* 若新旧内容元素类型一致，则克隆旧fiber，结合新内容生成新的fiber

* 若不一致，则基于新内容创建新的fiber。



同理，`updateTextNode(...)`：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/15.png)



`updateTextNode(...)`与`reconcileSingleTextNode(...)`核心逻辑一致：

* 若旧内容fiber的标签不是`HostText`,则基于新内容文本创建新的fiber

* 若是`HostText`, 则克隆旧fiber，结合新内容文本生成新的fiber



在本案例中，新内容数组for循环完成后：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/16.png)



因为新旧内容数组的长度一致，所以直接返回第一个新的fiber。然后同上，React将新的fiber设为父fiber的child。



不过若新内容数组长度与旧内容fiber及其相邻fiber的总个数不一致，React如何处理？



编写类似案例。



若新内容数组长度更短：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/17.png)

React将删除多余的旧内容fiber的相邻fiber。



若新内容数组长度更长：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/18.png)

React将遍历多余的新内容数组元素，基于新内容数组元素创建的新的fiber，并添加副作用标签 Placement（替换）。



新内容为数组时的diff流程总结：

![](https://terry-su.github.io/assets/blogs/understand-react-diff-algorithm-from-source-codes/flowchart-array.svg)



## 总结

通过React源码研究diff算法时，仅调试分析**相关代码**，能比较容易的得出答案。

Diff的三种情况：

1. 新内容为React元素
2. 新内容为文本
3. 新内容为数组



Diff时若比较结果相同，则复用旧内容Fiber，结合新内容生成新Fiber；若不同，仅通过新内容创建新fiber。

然后给旧内容fiber添加副作用替换标签，或者给旧内容fiber及其所有相邻元素添加副作用删除标签。

最后将新的（第一个）fiber设为父fiber的child。

   

## 参考资料

* The how and why on React’s usage of linked list in Fiber to walk the component’s tree: https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7

* [译]深入React fiber架构及源码: https://zhuanlan.zhihu.com/p/57346388

* Inside Fiber: in-depth overview of the new reconciliation algorithm in React: https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e