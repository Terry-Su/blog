---
title: Blog
postTime: 2019/7/3 12:00
abstract: Blog Abstract
comment: 0
isAutoTranslated: false
codePaths:
  - Foo.js
---

<Foo />

# Mode 1: Sandbox 
<CodeLive
html={`
<div id="test"></div>
`}
css={`
#test { width: 100px; height: 100px; background: blue; }
`}
js={`
document.getElementById( 'test' ).onclick = () => { console.log( "test!" ) }
`}
></CodeLive>

# Mode 2: Sandboxie React Component
