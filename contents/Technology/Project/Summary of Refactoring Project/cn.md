---
title: 记一次前端项目重构要点总结
postTime: 2019/7/4 8:15
abstract: 项目是公司主打业务产品之一的可视化子项目，与其他子项目几乎没有耦合，所以可以单独拎出来重构。
comment: 7
isAutoTranslated: false
---

![](https://user-images.githubusercontent.com/23733477/60633551-c2ce3b80-9e3d-11e9-951a-dead873002eb.png)

不知不觉已是2019年的7月，恍惚之间已工作四年。懵懵懂懂的成长，间歇性努力，实话说，对现在自己取得的成果不大满意。不过，好在时不时顿悟，知道适时作出改变。

此后发文会适当记录一些心路历程，与君共勉。


本文要点：

1. 什么项目，为何会重构？
2. 怎么重构的？
3. 重构前后对比



## 什么项目，为何会重构？

项目是公司主打业务产品之一的可视化子项目，与其他子项目几乎没有耦合，所以可以单独拎出来重构。

具体业务不作描述。技术主要用的是Vue2系列和JavaScript，还有一个自研的可视化工具库。第一个重构原因就是没有引入静态类型，导致查看一个对象结构需要翻来覆去在多个文件中查找。第二是因为之前新增代码模式一般为：“来一个需求加一段代码”，长期积累导致代码结构混乱，可读性差。第三是各个状态模块耦合度高，加大了代码维护难度。



## 怎么重构的？

一、在JavaScript中使用TypeScript。“什么？在JS中使用TS? 闻所未闻。 ” 在看到TS官网手册最后一条["Type Checking JavaScript File"](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)之前，我也这样想。其实，TS和VSCode（一款IDE）结合，也可以实现静态类型检测，只不过使用注释形式，一样支持`tsconfig.json`和自定义Typing。

```ts
type TypeApple = { name: string, count: number }
```



```js
/** @type {TypeApple} */
const apple = { name: 'foo', count: 100 }
```





二、细化模块分类。一般情况下，模块都会有耦合。但如果耦合度过高，往往是因为模块没有细分到位。如果细化模块？举例，假如有一个模块叫`Operation`，里面既包含操作相关逻辑，也有操作面板逻辑。随着业务发展，操作面板逻辑越来越多。我们完全可以将操作面板逻辑单独抽成一个模块`OperationPanel`。



三、解耦可视化库和Vue/Vuex。写业务的时候，很容易因为方便，在Vue组件或Vuex模块中代码越写越长，越来越难维护。这个项目也不列外。所以重构的时候，单独将可视化库喜爱那个管逻辑抽成模块，并使用类Vuex写法(state, getters, mutations, actions)进行管理。

```js
class Counter {
  // # state  
  /** @type {number} */
  count = 0

  // # getters
  get countText() { return `Count is: ${ this.count }` }

  // # mutations
  /** @param {number} count*/
  SET_COUNT = count => { this.count = count }
  
  // # actions
  /** @param {number} count*/
  logCount = ( count ) => {
    this.SET_COUNT( count )
    console.log( this.countText )
  }
}
```



四、最后一条，编写可维护性高的代码。这里说两个方法。

第一个是“使用`Map`”。处理“一个有多类型的数据”需要使用判断，常见有3种方法：`If`, `Switch`, `Map`。`If`的使用简单粗暴，容易理解。

```js
if ( animalType === 'dog' ) {
    console.log( 'Wang!' )
} else if ( animalType === 'cat' ) {
    console.log( 'Miao!' )
} else if ( animalType === 'bird' ) {
    console.log( 'Jiu!' )
}
```

`Switch`可以看做是`If`的简化。

```js
switch ( animalType ) {
    case 'dog':
      console.log( 'Wang!' )
      break
    case 'cat':
      console.log( 'Miao!' )
      break
    case 'bird':
      console.log( 'Jiu!' )
      break
}
```

而`Map`针对性最强，并且最简洁、最易于维护。

```js
const logMap = {
    dog: () => console.log( 'Wang!' ),
    cat: () => console.log( 'Miao!' ),
    bird: () => console.log( 'Jiu!' ),
}
logMap[ animalType ]()
```



具体使用也哪一种因场景而异，但多数场景下，使用`Map`可读性更强。



第二个是“使用getters和mutations”。比如定义一个模块的``：`operationGetters.js`,  里面提供各种用来获取与操作有关的常量和方法。

```js
export const OPERATION_TYPE_A = 0
export const OPERATION_TYPE_B = 1

export const OPERATION_TITLE_MAP = {
  [ OPERATION_TYPE_A ]: 'Title A',
  [ OPERATION_TYPE_B ]: 'Title B',
}

export const getOperationTitleByType = type => OPERATION_TITLE_MAP[ type ]
```

定义`mutations`则是定义一个提供相关各种变更数据方法的文件。在维护代码的时候，查找变更方法名即可直接找到更改数据的出处。

```js
export const SET_OPERATION_TITLE = ( operation, title ) => { operation.title = title }
```





## 重构前后对比



代码量减少了快一半，性能显著提升，最重要的是代码可读性、可维护性大大增强，从而淡定从容应对之后的新需求。
