---
postTime: 2018/10/09 14:53
comment: 11
---

![The Peak of Mountain QingCheng](https://terry-su.github.io/BlogCDN/images/photo/qing-cheng-shan.jpg)
*The Peak of Mountain QingCheng*

Before starting this written-in-English article, I'd like to thank   [@l3l_aze](https://www.reddit.com/user/l3l_aze) for pointing out my previous technology article's problems and giving me precious advice on how to write better in English. And after some time for preparation, I start writing articles in English again and will continue to write more.

Implicit type conversion is one of JavaScript's most hot and important features. To master it completely, I've searched lots of relevant articles, consulted the book "JavaScript: The Definitive Guide, 6th" and summarized those concepts, ideas, examples into this article.

> To learn a new knowledge point, we usually search and read a lot of relevant materials(blogs, StackOverflow, etc) online. However, to master it thoroughly, we'd better look for its origin from the definitive material like MDN or a definitive book to ensure its correctness.


## What's the implicit type conversion? 
JavaScript is very flexible, it will convert the type of a value as needed automatically.
For example:
```js
'' + 1 // '1'
```


## When will implicit type conversion happen?
Here lists commonly used situations:

**Expressions(with operators)**  
*Arithmetic*  
* `+`

```js
/* unary +, converse x to number */
+ x

+ 1 // 1
+ '1' // 1
+ true // 1
+ new Date() // (a numeric value)


/* two operands */
a + b

// 1. if either is an object, converse it to a primitive first
{} + {} // '[object object][object object]'
[] + [] // ''
[] + new Date() // (A date string)

// 2. if one is a string, converse the other to a string
1 + '' // '1'
'' + 1 // '1'
'' + true // 'true'

// 3. otherwise, converse both to numbers
1 + true // 2
true + true // 2
```

* `-`, `*`, `/`, `++`, `--`

```js
/* Converse value or values to number */
- '1' // -1
[] - 1 // -1
[] - {} // NaN
```


*Relational*
* `==`, `!=`

```js
/* two operands */
a == b

// 1. if one is `null` and the other is `undefined`, they are equal
null == undefined // true

// 2. if one is a number and the other is a string, convert the string
// to a number, compare again
1 == '1' // true

// 3. if either is boolean, convert it to a number, compare again
true == 1 // true
false == 0 // true

// 4. if one is an object, and the other is a number or a string, 
// convert the object to a primitive, compare again
[ 1 ] == 1 // true
[ '1' ] == '1' // true
```

* `>`, `>=`, `<`, `<=`

```js
/* two operands */
a > b

// 1. if either is an object, convert it to a primitive, compare again
[ 2 ] > 1 // true

// 2. if both are strings, compare them using alphabetical order
'b' > 'a' // true

// 3. if either is a number, convert one or two not number to number
'2' > 1 // true
```

* `in`

```js
/* if left operand isn't a string, convert it to a string  */
a in b

'1' in { 1: '' } // true
1 in { 1: 'a' } // true
1 in [ 'a', 'b' ] // true
```


*Logic*  
* `&&`, `||`, `!`

```js
/* if either isn't booelan, convert it to a boolean value */
Boolean( null || undefined || 0 || -0 || NaN || '' ) // false
Boolean( 1 && 'a' && {} && [] && [0] && function(){} ) // true
```

Note that **following** `?:`, `if`, `else if`, `while`, `do/while` and `for` use the **same implicit type conversion way** as `&&`, `||` and `!`(Logic expression).

*Conditional*
* `?:`


**Statements**  
*Conditional*  
* `if`, `else if`

*Loop*
* `while`, `do/while`, `for`







## How about explicit type conversion
Explicit type conversion makes the type conversion codes clear.   
Although there're many ways to perform an explicit type conversion, such as `toString()` and `parseInt()`, it's recommended to use `Boolean()`, `Number()`, `String()` or `Object()` functions.

```js
Boolean( 1 ) // true
Boolean( 0 ) // false

Number( '1' ) // 1

String( 1 ) // '1'

Object( 1 ) // new Number(1)
```


## Common JavaScript Type Conversion
The following reference table, from the book "JavaScript: The Definitive Guide, 6th", is especially convenient to look up common type conversion in JavaScript

![Little Bar](https://terry-su.github.io/BlogCDN/images/javascript-type-conversion.png)
*"JavaScript-The Definitive Guide 6th" 3.8.0*



## Conclusion
Implicit type conversion can be very useful sometimes, simplifying our codes, for example. But we'd better also pay attention to the potential risk that conversed value could be unexpected if someone wasn't familiar with the rules of implicit type conversion enough. To avoid this, use explicit type conversion instead.