---
postTime: 2018/6/23 1:57
comment: 6
---
There're two popular methods to order css properties:
* type
* alphabetic

Alphabetic order, however, is more suitable for searching rather than classifing css properties. In most situations, we prefer a not only consistent but also clear-type way to order css properties.  
The following is an ordering example recommended by author:
```stylus
.element
  /* Position */
  position absolute
  left 0
  top 0
  
  /* Display & Box model */
  display flex
  box-sizing border-box
  width 500px
  height 500px
  padding 5px
  margin 10px
  border 1px solid grey
  border-radius 5px
  justify-content center
  align-items center

  /* Text */
  font-size 16px
  line-height 20px
  font-weight bold
  
  /* Other */
  cursor pointer
  
  /* Color */
  color blue
  background white
```

Absolutely we can justify appropriate types' orders and subordinary types' orders for own best experience of writing css properties. 