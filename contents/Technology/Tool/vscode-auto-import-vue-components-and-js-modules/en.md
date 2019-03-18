---
title: 不再手写import - VSCode自动引入Vue组件和Js模块
postTime: 2018/7/6 17:50
comment: 1
---

如要自动引入Vue组件，首先需安装VSCode拓展： [`Vetur`](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

## 自动引入Vue组件和普通Js模块
在根目录添加 `jsconfig.json` 。  
每次修改`jsconfig.json`后需**重启该VSCode窗口**

```json
{
  "include": [
    "./src/**/*"
  ],
}
```

![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/vue.gif)
![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/javascript.gif)

<!-- <div style="margin-top:300px;"></div> -->

## 支持Webpack别名路径
同上，需更新 `jsconfig.json`

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
  },
  "include": [
    "./src/**/*",
  ],
}
```

![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/vue-alias.gif)
![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/javascript-alias.gif)

<!-- <div style="margin-top:300px;"></div> -->

## 在JS中自动引入node_modules中的JS
1. 以`lodash`为例，安装 `lodash`: `npm install lodash`
2. 在根目录添加 `jsconfig.json`

```js
{
  "compilerOptions": {
    "checkJs": true,
  },
  "include": [
    "node_modules/lodash/*"
  ],
}
```
3. 输入关键字后，点击提示灯泡（快键键: `Ctrl/Command + .`），选择JS模块

> 注意： `checkJs`可能会引起部分项目语法报错，如有报错可使用下面的方法作为替代方案。




![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/javascript-node-module.gif)

 
<!-- <div style="margin-top:300px;"></div> -->

 
## 使用`Npm Intellisense`自动引入node_modules中的JS
1. 安装VSCode拓展： [`Npm Intellisense`](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
2. 配置 `Npm Intellisense`

```js
{
  "npm-intellisense.scanDevDependencies": true,
  "npm-intellisense.importES6": true,
  "npm-intellisense.importQuotes": "'",
  "npm-intellisense.importLinebreak": ";\r\n",
  "npm-intellisense.importDeclarationType": "const",
}
```
3. VSCode输入命令（`Ctrl/Command + Shift + P`）: `Npm Intellisense: Import module`后, 选择引入包


![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/vue-node-module.gif)



## 其他
自动引入Vue组件和JS模块后，按住`Ctrl/Command`点击路径可直接跳到该文件
![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/vue-view-source.gif)
![](https://terry-su.github.io/BlogCDN/images/gifs/vscode-auto-import-vue-components-and-javascript-modules/javascript-view-source.gif)


