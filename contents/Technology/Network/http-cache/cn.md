---
title: 轻松学会HTTP缓存（强缓存，协商缓存）
postTime: 2020/3/30 9:30
comment: 9
isAutoTranslated: false
# codePaths:
#   foo.js
---
若读者对“强缓存”，“协商缓存”字眼非常熟悉，但又不知道他们具体是什么，亦或有读者还不了解HTTP缓存，那么本文将为读者一一讲解。

## HTTP缓存流程
在介绍什么是强缓存、协商缓存前，让我们先了解HTTP缓存的流程，因为强缓存、协商缓存只是其中2步。

![image](https://user-images.githubusercontent.com/23733477/77868295-49009c80-726d-11ea-87a3-17a5bd0a657b.png)

## 强缓存
“检查缓存是否过期”一步即强缓存。若缓存未过期，直接使用浏览器本地缓存，不用请求服务器。  

检查缓存是否过期依据请求报文中的2种首部：过期时间`Expires`和有效时间`Cache-Control:max-age`。例子：
* `Expires: Fri, 05, Jul, 2020, 05:00:00 GMT`
* `Cache-Control: max-age=60000`

前者为缓存具体的过期时间，后者为缓存有效期。`Cache-Control: max-age`的优先级高于`Expires`。


## 协商缓存
“协商缓存”可以理解为一个动作：“与服务器协商是否更新缓存”。

当检查到缓存已过期，缓存端需要与服务器协商是否更新缓存。在请求报文中，用于协商的条件类首部也有2种，时间再验证`If-Modified-Since`和实体标签再验证`If-No-Matched`。若条件为真，服务器会返回新文档给缓存。否则，服务器返回304(Not Modified)。它们的格式为:
* `If-Modified-Since: <date>`
* `If-None-Matched: <tags>`

日期再验证`If-Modified-Since`从字面即可理解：如何从某个时间之后文档被修改过。

实体标签再验证`If-None-Matched`同样可理解为：若缓存端的实体标签Etag(Entity Tag)与服务器不匹配。

实体标签是什么？ 这里要从既然有了日期再验证为何还需要实体标签验证说起。

考虑一种特殊情况，若验证时，发现服务器上的文档被重写过文件修改时间，但内容不变，那这个时候日期再验证不通过，但实际并没有必要更新文档。所以引入了实体标签验证。实体标签Etag是为文档提供的特殊标签，格式为字符串，可看作唯一id。

若实体标签再验证不通过，服务器会返回新文档和新的Etag给缓存。

实体标签再验证的优先级高于日期再验证。

日期再验证对应服务端响应头部为：`Last-Modified: <date>`，实体标签再验证对应服务端响应头部为： `ETag: <tag>`。


## 客户端刷新和重载
那么客户端的刷新和重载如何影响HTTP缓存？事实上，每个浏览器都由自己的一套处理机制。一般来说，普通刷新不会影响缓存，但强制刷新（重载）会让缓存失效，重新向请求服务器文档。

## 实践
光有理论没有实践验证肯定不够。此处使用一个案例体验协商缓存。

新建一个文件夹，新建index.html, 内容为“Test Cache”。使用[serve](https://github.com/zeit/serve)将该文件夹静态服务化。打开Chrome，新建标签页，打开开发人员工具，切换到网络模块，然后打开服务化后的地址: `http://localhost:5000`。

![image](https://user-images.githubusercontent.com/23733477/77868100-79940680-726c-11ea-9b68-383c08747230.png)
可看到服务返回状态为200。
接下来刷新页面。
![image](https://user-images.githubusercontent.com/23733477/77868125-8a447c80-726c-11ea-89ce-a30c89b5e561.png)
服务器返回状态变为304(Not Modified)。
![image](https://user-images.githubusercontent.com/23733477/77868143-a0ead380-726c-11ea-8d5c-2e28e3cd1aec.png)
请求首部用的是实体标签再验证`If-None-Match:<tag>`。
![image](https://user-images.githubusercontent.com/23733477/77868154-b233e000-726c-11ea-9e82-f85bc2590f78.png)
响应首部返回的Etag与请求中的Etag相同。

## 总结
HTTP缓存的2个要点就是：
1. 检查缓存是否过期（强缓存）
2. 若缓存过期，与服务器协商是否更新缓存（协商缓存）。  

而这2点每个都包含相关的2个报文请求首部：
* 强缓存：过期时间`Expires` 和有效期`Cache-Control: max-age`
* 协商缓存：日期再验证`If-Modified-Since`（对应响应首部：`Last-Modifed`）和实体标签再验证`If-Not-Matched`（对应响应首部：`Etag`）



## 参考资料
* 《HTTP权威指南》 > 第7章 > 缓存
* [强缓存和协商缓存区别和过程](https://www.jianshu.com/p/f6525b0f8813)