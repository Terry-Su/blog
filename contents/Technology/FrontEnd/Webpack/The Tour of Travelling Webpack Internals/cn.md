---
title: 看完Webpack源码，我学到了这些
postTime: 2020/1/15 9:09
comment: 8
isAutoTranslated: false
---

![](https://user-images.githubusercontent.com/23733477/72396026-56ca7980-3776-11ea-8711-abf38176d1fe.png)

继React,Vue，这是第三个着重阅读源码的前端项目-Webpack。本文主要以：  
* WHY: 为何要看Webpack源码
* HOW: 如何阅读Webpack源码   
* WHAT: 看完源码后学到了什么 

三个方向展开。
## WHY
诚然Webpack这是一个前端工程化工具，理解容易， 使用简单，似乎没有深入研究的必要。那为什么还要费心费力阅读其源码？这，把正在写此篇文章的我也问住了。理提纲时，认为WHY最好写，几句话就可带过，但事实证明真要较真这一块还值得一说。    
擅自揣测下会阅读Webpack源码伙伴可能的动机：  
1. 丰富工作经验  
2. 技术真爱粉，知其然亦须知其所以然，同时学习方法  
3. 与工作或个人项目相关，参考学习  
4. 看有人写相关文章，也看看了解下      

作者最先是原因是4，然后是1，2。当然，1，2应该是大多数人看项目源码的动机。

## How 
### 搭建源码调试环境
要阅读源码，首先拿到源码，然后最后能边调试边阅读。当然，如果智力和推理能力惊人，大可以直接在Github上在线阅读。
有2种方法下载源码。一种是最常见的git clone,将Github上webpack项目clone到本地，pull后与webpack官方最新代码保持一致，一劳永逸。不过作者尝试第一种方法时，总是clone不下来，很大可能是由于webpack源文件过大且github服务器clone一直很慢。
于是退而求其次，使用第二种方法：下载Webpack源码release版本。选择一个打算阅读的webpack源码版本，直接下载"Source code(zip)"即可。速度非常快，因为不包含.git。
![image](https://user-images.githubusercontent.com/23733477/72396287-2a632d00-3777-11ea-9aa8-7ba669a1869a.png)


IDE作者使用VSCode,调试node很方便。拿到源码后，在目录新建一个文件夹，写一个简单的webpack案例，然后使用VSCode进行调试。    
不过，在实际操作中，直接使用下载源码中的webpack.js调试可能会出现报错`Cannot find module 'json-parse-better-errors'`或`Cannot find module 'webpack/lib/RequestShortener'`，只需运行`npm install webpack webpack-cli --save-dev`，即可解决报错，且不影响调试源码。

![image](https://user-images.githubusercontent.com/23733477/72396313-42d34780-3777-11ea-9216-a5b60904a2e0.png)



此附作者在调试时[使用版本](https://github.com/Terry-Su/learn-webpack/archive/0.0.1.zip)参考，下载后使用VSCode打开webpack-4.41.4(modified)，安装依赖，安装webpack和webpack-cli，按F5即可启动调试。

## 调试，理清大致脉路走向
Webpack源码量庞大，把每一行代码都读懂确实没有必要，但是我们至少要知道它的整体运行流程，知道它反复用到的核心代码，以及各个模块的生命周期如何运转。


### 找核心功能源码
代码量大，想要在走整体流程时恰好找核心功能的源码，困难重重，至少对于webpack源码是这样，因为其独特的插件和回调结构。
不过，我们可以根据每一个想要了解的核心功能，单独去寻找和阅读相关源码。比如，如果我们想看webpack如何打包生成bundle.js，可通过webpack一定会调用NodeJS文件系统输出文件方法，全局搜索"writeFile"找到相关代码，或通过bundle.js中的关键字"// Check if module is in cache"进行搜索。

![image](https://user-images.githubusercontent.com/23733477/72396333-51b9fa00-3777-11ea-9b46-509e137da8af.png)



## What
通过边调试边阅读代码，了解代码整体走向以及webpack如何打包生成bundle.js，作者学到了以下内容：
* tapable插件机制
* 简化版Webpack运行流程
* bundle.js内容如何生成

### Tapable
[Tapable](https://github.com/webpack/tapable)在源码中应用随处可见，要了解源码，首先得学习tapable机制。其实它并不复杂，并且我们只需要知道它的基本作用和用法即可。
Tapable 可理解为一套钩子回调函数机制，每一个钩子可订阅多个函数，发布钩子时会运行该钩子订阅该的多个函数。
用一个简单案例说明。
```js
const { SyncHook } = require('tapable')
class Car {
    constructor() {
        this.hooks = {
           // # 添加一个钩子
            start: new SyncHook()
        }
    }
}
const car = new Car()
// start钩子订阅一个函数
car.hooks.start.tap( 'run slowly', () => console.log('start running slowly')  )
// start钩子订阅另一个函数
car.hooks.start.tap( 'run mediumly', () => console.log('start running mediumly') )

// 发布钩子
car.hooks.start.call()   // 输出: run slowly  run mediumly
```


### 简化版Webpack运行流程
![4](https://user-images.githubusercontent.com/23733477/72341656-b89ecb00-3705-11ea-8bd8-7e7232333f3d.png)


### bundle.js内容如何生成
未压缩的bundle.js文件结构一般如下：
```js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
....
```
那么Webpack如何生成这些内容？
其实Webpack对于内容分两步处理，第一步先通过loader（默认为babel-loader）生成组合JS代码。第二步将组合JS代码放入webpack默认函数中，从而避免变量泄露。
如打包前：  
`foo.js`  
```js
export const foo = () => 'hello foo!'
```

`bar.js` 
```js
import { foo } from './foo.js'
foo()
console.log( 'hello bar!' )
```

打包第一步，通过loader（默认为babel-loader）生成组合JS代码：
```js
...
const foo = () => 'hello foo!'
...
\r\n__WEBPACK_MODULE_REFERENCE__0_666f6f_call__()\r\nconsole.log( 'hello bar!' )
...
```

打包第二步，组合JS代码放入webpack默认函数中。
```js
/******/ (function(modules) { // webpackBootstrap\n
...
const foo = () => 'hello foo!'
...
foo()
console.log( 'hello bar!' )
...
````
值得注意的是，核心文件为`ConcatenatedModule.js`, 通过遍历`modulesWithInfo`从而生成打包代码。


## 常见问题
1. `runtime`是什么？   
不管在webpack源码，还是Vue源码和其他地方，runtime经常出现。runtime究竟是什么？
经过反复查阅资料和推敲，runtime代码可以理解为编译后生成的代码。比如，对于React，runtime代码就是编译JSX代码后生成的JS代码。对于Vue，runtime代码则是编译template,script,style后生成的JS代码。

2. 热更新，Code Splitting, Tree-shaking等是如何实现?   
Webpack内容较多，核心模块原理也不少，比如loader如何运转，Code Splitting如何实现，Tree-Shaking和热加载又是怎么做到的。但毕竟时间有限，此次阅读源码的目标不是大而全的弄懂所有内容，而是掌握Webpack的主要运转流程以及了解较为感兴趣的几个模块。所以其他模块原理以后有机再加入此文。对相应模块模块感兴趣的伙伴可网上先自行搜索相关内容。


## 阅读源码资源推荐
* [how-react-works.pdf](https://raw.githubusercontent.com/sokra/slides/master/data/how-webpack-works.pdf)
* [深入浅出webpack-吴浩麟](https://webpack.wuhaolin.cn/)
* [help developers better understand how webpack works: artsy-webpack-tour](https://github.com/TheLarkInn/artsy-webpack-tour)
* [build your own webpack](https://www.youtube.com/watch?v=Gc9-7PBqOC8)
