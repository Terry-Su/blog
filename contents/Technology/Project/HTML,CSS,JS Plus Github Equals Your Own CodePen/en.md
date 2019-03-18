---
postTime: 2018/09/11 00:08
comment: 9
---

![Little Bar](https://terry-su.github.io/BlogCDN/images/photo/little-bar.jpg)
*( Little Bar at ChengDu, China )*


[CodePen](https://codepen.io) and [JSFiddle](https://jsfiddle.net/) are both convenient online codes editors for front-end developers. And you can demonstrate your code examples vividly in your blog or website by inserting an online editor example, which displays codes and the final result.  


However, how an editor's style can stay the same with the style of your blog or website is a problem, and you have to rely on them deeply. Because of these limits, I'm wondering if we can write our own code viewer using totally front-end technologies without any dynamic server, and the answer is amazing "YES".



## Showcase
<iframe src="https://terry-su.github.io/CDN/CodeViewer/index.html?defaultDataUrl=https://terry-su.github.io/CDN/CodeViewer/examples/hello.js" frameborder="0"></iframe>



## How it works
There're 3 HTML layers:
```css
 __________
/_________/ User HTML

 __________
/_________/ CodeViewer HTML

 __________
/_________/ Basic HTML
```
* Basic HTML: most basic HTML that receives the data, HTML/CSS/JS strings, for rendering standalone web page from parent HTML.


* CodeViewer HTML: building the user interfaces to update basic HTML, and receiving settings from parent HTML.


* User HTML: yeah, it applies some settings, such as default data or default display mode, on CodeViewer HTML.



## How it's built
Based on concepts above, you can already build a [simplified CodeViewer HTML](https://terry-su.github.io/CDN/CodeViewer/basicVersion/index.html), and the [source codes](https://github.com/Terry-Su/CDN/tree/master/CodeViewer/basicVersion) are so simple that it doesn't even need Webpack at all.   

However, to organize the interaction logic of CodeViewer better, using React and Redux is a good idea. CodeViewer is now using Typescript + React + [Dva](https://github.com/dvajs/dva)(a light framework including redux) as development environment.     

And CodeViewer is deployed simply on a commonly used static server: [Github(Github Pages)](https://pages.github.com/).



## Where and how to use it
In fact, you can use it anywhere only if there supports iframe. Specifically, `github.io` Github pages support iframe, like [the official website of a canvas library](https://drawjs.github.io) I wrote before.   

To bind content with editor, you add content url as a parameter immediately after the CodeViewer url:   "Codeviewer url + `?defaultDataUrl=` + Content url"

Then, just insert `<iframe src="your-code-viewer-url"></iframe>` into your blog or website page.  


Similarly, you can also configure default display mode. For more detail, visit [Codeviewer's source codes page](https://github.com/Terry-Su/CodeViewer). 