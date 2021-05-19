---
title: 状态管理本应如此简单
postTime: 2021/5/19 17:20
comment: 16
isAutoTranslated: false
---
![](https://terry-su.github.io/assets/blogs/state-management-should-be-simple-like-this/ts-method.gif)


2021年520前夕。近一年来主要都在做业务，不过对不断提升Coding质量与速度的追求和思考一直没停过。机缘巧合之下，有幸着重花时间完善了一套稳定、易用的状态管理方案。

作者在工作历程中，由最初用redux，然后到用vuex，再到实验mobx、dva、react hooks甚至是自研工具，最后回归redux。

在此期间，一直在探寻简单易用，并且有完整类型提示的方案。就是当我们输入一两个关键字，IDE自动弹出模型对应dispatch方法，再输入空字符串''，自动提示可能要调用的方法等。日常要写太多状态管理代码，完全没必要敲很多重复内容。

那么重新写一个状态管理库？

redux已经很好用，只是代码略微繁琐，为何要重新写？基于redux封装是否可行？

那是否要集成其他路由、模块化加载和网络请求等模块，让用户通过这个工具做大多数事？

这其实是很多集成式框架做的事。但状态管理本身就是单独一个模块，没必要和其他模块耦合在一起。模块化对于项目未来局部升级和改造要远方便于集成式。

既然讲到了类型推导提示，那么是否只有TypeScript项目才能完美支持？

当然很多类型都是借助TypeScript定义，但如今利用[JSDoc注释类型写法](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)也能让JS项目支持类型提示和推导。

是否能兼容已有项目？

只要遵循相应规则，正常情况下都能兼容。

卖了那么久关子，接下来放出项目地址：

[Tredux](https://github.com/tredux-org/tredux)：https://github.com/tredux-org/tredux

其实封装难度并不大，最难的是如何让它在最简单的用法下，能够覆盖日常业务开发场景。

如果各位大佬觉得这套方案还可以，想用到自己项目甚至是公司项目中，但又不太放心依赖外部库，大可以将源码（一个TS文件）放到项目中单独引用。

现有方案已在业务项目中稳定运行，欢迎各位试用。



