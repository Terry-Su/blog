---
postTime: 2017/07/01 14:57
comment: 1
---

# Introduction
Iterator is one of the most common design modes in daily development. Let's explore the iterator continent in the javacript world, here we go!


# Gist Iterator Mode
It's the basic iterator mode concept:   
![](https://sfault-image.b0.upaiyun.com/313/415/3134156573-59538bf9ed814_articlex)   
And it's like this in javascript world:   
![](https://sfault-image.b0.upaiyun.com/590/033/590033887-59538bd8a3857_articlex)    

# Grammar rules
## Attention
Assume that "iterable" is an adjective, and "iterableFn" is a iterable.  
It's a little confusing when lots of "iterable" appear at the same time.

## Relation between iterable and iterator
Iterator can be created by iterableFn(an iterable), iterableFn belongs to iterable sources.

## Iterables 
### Iterable sources
* Array
* String
* Map
* Set
* Dom Elements
* Arguments

### Get iterableFn(used to generate iterator)
IterableFn can be derived from iterable source by its property: Symbol.iterator, for example: `const iterableFn = [][Symbol.iterator]`
> **Symbol.iterator**
> A method that returns the default Iterator for an object. Called by the semantics of the for-of statement.

```js
/** Test in chrome 55  **/
// Array
console.log( [][Symbol.iterator] )    // function values() { [native code] }

// String
console.log( ''[Symbol.iterator] )    // function [Symbol.iterator]() { [native code] }

// Map
console.log( new Map([[]])[Symbol.iterator] )    // function entries() { [native code] }

// Set
console.log( new Set([])[Symbol.iterator] )    // function values() { [native code] }

// Dom elements
console.log( document.getElementsByTagName('body')[Symbol.iterator] )    // function values() { [native code] }

// arguments
function test() {
	console.log( arguments[Symbol.iterator] )
}
test(1, 2, 3)    // // function values() { [native code] }
```

### Iterable sources' consumers
Follow consumers' implementations mainly depend on iterables.Howerver, the examples are irrelevant to topic.
* for of
```js
for(const i in [1, 2]) {
    cosnole.log(i)
}     
    // 1
    // 2
```
* ...(The spread opeartor)
```js
console.log( [..."ab"] )     // ["a", "b"]
```
* Array.from
```js
console.log( Array.from("ab") )    // ["a", "b"]
```

## Iterators
Iterator is common used, as to decouple algorithms.
### Iterator = iterableFn()
After iterable's implementation, it returns an object called iterator, which uses "next" method to iterate.
```js
/** Test in chrome 55  **/
// Array
console.log( [][Symbol.iterator]() )    // ArrayIterator {}

// String
console.log( ''[Symbol.iterator]() )    //  StringIterator {}

// Map
console.log( new Map([[]])[Symbol.iterator]() )    // MapIterator {[undefined, undefined]}

// Set
console.log( new Set([])[Symbol.iterator]() )    // SetIterator {}

// Dom elements
console.log( document.getElementsByTagName('body')[Symbol.iterator]() )    // ArrayIterator {}

// arguments
function test() {
	console.log( arguments[Symbol.iterator]() )
}
test(1, 2, 3)    // ArrayIterator {}
```
Add value and Implement method "next":
```js
/** Test in chrome 55  **/
// Array
console.log( [1, 2][Symbol.iterator]().next() )    // {value: 1, done: false}

// String
console.log( 'ab'[Symbol.iterator]().next() )    //  {value: 'a', done: false}

// Map
console.log( new Map([[1, 'a']])[Symbol.iterator]().next() )    // {value: [1, 'a'], done: false}

// Set
console.log( new Set([1, 1, 2])[Symbol.iterator]().next() )    // {value1: , done: false}

// Dom elements
console.log( document.getElementsByTagName('body')[Symbol.iterator]().next() )    // {value: body(dom), done: false}

// arguments
function test() {
	console.log( arguments[Symbol.iterator]().next() )
}
test(1, 2, 3)    // {value: 1, done: false}
```

### Iterator = generator() 
Setting iterator mutually again and again seems inefficient, syntactic sugar is needed. Fortunately, ES6 provides the useful "generater"
```js
function* iteratorMaker() {
    yield 1
    yield 2
}

const iterator =  iteratorMaker()

console.log( iterator )    // iteratorMaker {[[GeneratorStatus]]: "suspended", [[GeneratorReceiver]]: Window, [[GeneratorLocation]]: Object}

console.log( iterator.next() )    // {value: 1, done: false}

console.log( iterator.next() )    // {value: 2, done: false}

console.log( iterator.next() )    // {value: undefined, done: true}
```


# Application
Iterator can be applied in wide situations, there's a sample to generate increasing id numbers.
```js
function* idIteratorMaker() {
    let id = 0
    while (true) {
    	yield id++
    }
}

function create(idIterator) {
	return idIterator.next().value
}

const idIterator = idIteratorMaker()

const a = create(idIterator)
const b = create(idIterator)
const c = create(idIterator)

console.log(a)     // 0
console.log(b)     // 1
console.log(c)     // 2
```


# Conclusion
Obviously, iterator makes codes more readable and matainable.  





# Reference
1. [http://exploringjs.com/es6/ch_iteration.html#sec_iterating-language-constructs](http://exploringjs.com/es6/ch_iteration.html#sec_iterating-language-constructs)  
2. [https://tc39.github.io/ecma262/#table-1](https://tc39.github.io/ecma262/#table-1)
