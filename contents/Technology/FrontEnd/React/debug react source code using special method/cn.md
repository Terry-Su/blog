---
title: 另辟蹊径搭建阅读React源码调试环境-支持所有React版本细分文件断点调试
postTime: 2020/6/21 22:43
abstract: 若要高效阅读和理解React源码，搭建调试环境是必不可少的一步。而常规方法：使用`react.development.js`和`react-dom.development.js`调试，虽然方便，但无法知道每段代码属于哪个细分文件，所以本文将介绍一种取巧的方法搭建便于调试React源码的环境，支持断点调试细分文件，并且此方法理论上可应用于所有Reat版本。
comment: 12
isAutoTranslated: false
---
![](https://terry-su.github.io/assets/blogs/debug-react-source-code-in-special-way/gif.gif)


## 引言（为什么写这篇文章）
若要高效阅读和理解React源码，搭建调试环境是必不可少的一步。而常规方法：使用`react.development.js`和`react-dom.development.js`调试，虽然方便，但无法知道每段代码属于哪个细分文件，所以本文将介绍一种取巧的方法搭建便于调试React源码的环境，支持断点调试细分文件，并且此方法理论上可应用于所有Reat版本。

> 最近一个月忙着换工作，这周终于有时间继续写发文章。写文章耗时短，搭建工具耗时较长，读者们可主要看工具使用模块。
> 
> React使用当前最新版本：`16.13.1`
>
> 今年会写一个“搞懂React源码系列”，把React最核心的内容用最易懂的方式讲清楚。2020年搞懂React源码系列：
> * React Diff原理
> * React 调度原理
> * （当前）搭建阅读React源码环境-支持React所有版本断点调试细分文件
> * React Hooks原理

## 快速使用
就像用手机并不一定要知道它的生产过程，使用源码调试环境也不一定要知道它的构建方法。

### 方法1: 线上调试
![](https://terry-su.github.io/assets/blogs/debug-react-source-code-in-special-way/online-example.png)
访问地址：https://terry-su.github.io/debug-react-source-code/example/react-16.13.1

### （推荐）方法2：下载对应直接调试源码文件
此方法优势是可修改源码，比如在源码中添加注释。

使用步骤：

1 . 访问项目[debug-react-source-code](https://github.com/Terry-Su/debug-react-source-code)，选择要调试React版本对应分支,然后点击下载压缩包。

![](https://terry-su.github.io/assets/blogs/debug-react-source-code-in-special-way/switch-branch.png)
![](https://terry-su.github.io/assets/blogs/debug-react-source-code-in-special-way/download.png)

当前（2020/6/21）版本列表：
* [debug-react-16.13.1](https://github.com/Terry-Su/debug-react-source-code/tree/debug-react-16.13.1)
* [debug-react-16.6.0](https://github.com/Terry-Su/debug-react-source-code/tree/debug-react-16.6.0)


2 . 将压缩包解压后，用vscode打开该文件夹。vscode需安装[Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)拓展，用于在vscode对源码添加断点

3 . 安装依赖后，开启服务
```
npm install
```
```
npm start
```

4 . 在源码中添加断点，按F5启动调试即可
![](https://terry-su.github.io/assets/blogs/debug-react-source-code-in-special-way/vscode-example.png)

~ ~ ~ ~ ~ ~

~ ~ ~ ~ ~ ~

## 背景
正片现在开始。

接下来讲讲搭建该调试环境背景。React官方建议直接使用源码项目中创建生成的`react.development.js`和`react-dom.development.js`。

但此方法无法看到每段代码所在具体源文件。最好的方案是能够直接调试源码中的细分文件。

其实之前网上可以找到实现此方案的方法，用webpack新建一个项目，然后想办法引入React源码中的各个模块，再添加各种配置，修改源文件以解决各种特殊情况。我之前也尝试过，但发现随着版本更新，该方法已逐渐不再适用，因为会遇到无法解决的特殊情况。

根本原因是因为React源码的打包配置较多，且含有自定义配置，所以即使给`rollup`配置了`sourcemap`也不会生效。
> 有人给react提过[一个编译react生成sourcemap的issue](https://github.com/facebook/react/issues/14361)，但Dan的回复是："你应该具备不依赖sourcemap调试开发模式下源码的能力"。HaHa


但是，能够调试源码文件的确是刚需，怎么办呢？


## 实现方法
于是，开始从其他突破口寻找解决方案。生成sourcemap的方案走不通，那通过`react.development.js`反过来生成各种细分文件是否可行？

如果要生成各个细分文件，就需要它们的路径信息，在哪里添加？

既然react源码是通过`rollup`打包生成，那么，能否在`rollup`配置中添加一个自定义插件，往`react.development.js`中注入代码对应路径？

顺着这个思路，一番尝试后，发现有一两种特殊情况要处理，但最终目的成功实现！是的，目前所搭建调试环境就是使用此方法。

具体实现细节较复杂，这里先简单说下主要流程：

1 . 生成注入细分源码文件路径信息的`react.development.js`和`react-dom.development.js`

2 . 从`react.development.js`和`react-dom.development.js`中提取核心数据，反向生成源码文件

3 . 根据核心数据，新建react,react-dom对应html和主要html,使用iframe实现隔离react、react-dom代码作用域和使不同html能够通信。

## 衡量利弊
此方法优点：
* 简化（移除flow类型代码和生产环境相关代码）
* 方便使用，可放在线上调试（体验地址：https://terry-su.github.io/debug-react-source-code/example/react-16.13.1/）


此方法缺点：
* 没有Flow类型代码
* 没有生产环境相关代码

如何解决缺点？方法就是配合原始源码细分文件一起阅读，比如查看一个对象的类型结构。
但大多数情况下，此方法都适用。


## 具体实现
本小节仅建议想了解此工具构建原理的同学阅读， 对于只需要获取调试环境的读者，可跳过此小节。

1 . 下载react源码，安装依赖项。

2 . 创建自定义`rollup`插件，生成新的`build.js `：在新`build.js`中引入自定义`rollup`插件，该插件的作用是给每个文件的头部和尾部添加特殊起始标记和结束标记，每个标记都包含该文件的路径信息
运行新的`build.js`，从而生成注入了细分文件路径信息的`react.development.js`和`react-dom.development.js`

3 . 处理`react-development.js`和`react-dom.development.js`，生成核心数据：基于两个JS文件，生成对应核心数据，类型结构为：`{outputFile: string, text: string}[]`。`outputFile`是反向输出的文件路径，`text`为文件内容。

4 . 基于核心数据，创建源码调试环境: 创建`dependency-react.html`和`dependency-react-dom.html`和其他所需文件。目录结构为：
```
/react.development/
/react-dom.development/
/babel.js
/dependency-main.html
/dependency-react.html
/dependency-react-dom.html
/index.html
/index.js
```

其中，`index.js`即为调试入口文件。

完整内容建议感兴趣的同学直接阅读源码：[debug-react-source-code](https://github.com/Terry-Su/debug-react-source-code)。


## 预告
下一篇将写React hooks的原理。Hooks的精髓往往不是的它的实现原理，而是设计理念。但弄懂React hooks原理，能让我们进一步加深对hooks思想和设计方式的理解。
