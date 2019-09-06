---
title: Blog
postTime: 2019/7/3 12:00
abstract: Blog Abstract
comment: 0
isAutoTranslated: false
# components:
#   Foo: components/Foo.js 
---


# Mode 1: Sandbox 
<LiveSandbox
name="TestSandbox1" 
html={`
<div id="test"></div>
`}
css={`
#test { width: 100px; height: 100px; background: blue; }
`}
js={`
document.getElementById( 'test' ).onclick = () => { console.log( "test!" ) }
`}
/>


# Mode 2: Sandboxie React Component
1234567